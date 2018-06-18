/**
 * @file: ModalContent
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */
import React from 'react'
import { close, Header, Body, Footer, Sep } from './index'
import transaction from '../transaction'

const bodyPrefix = 'i18n-modal-body-'
export default class ModalContent extends React.Component {
  state = {
    value: this.props.value,
    index: this.props.index,
    fetching: false
  }

  static defaultProps = {
    index: 0,
    updateValue: () => {},
    onActiveUpdate: () => {}
  }

  componentWillReceiveProps(nextProps) {
    const newState = {}
    if ('value' in nextProps && nextProps.value !== this.state.value) {
      newState.value = nextProps.value
    }
    if ('index' in nextProps && nextProps.index !== this.state.index) {
      newState.index = nextProps.index
    }
    this.setState(newState)
  }

  handleUpdateLang = async lang => {
    const list = this.idList
    const id = list[this.state.index]
    const str = await transaction.getLangInfo({ id })
    if (typeof str === 'string' && str) {
      const newValue = this.state.value.slice()
      newValue[this.state.index] = str
      this.setState({
        value: newValue
      })
    }
  }

  componentDidMount() {
    this.handleUpdateLang(this.lang)
    transaction.addListener('update:lang', this.handleUpdateLang)
    const list = this.idList
    this.props.onActiveUpdate(list[this.state.index], null)
  }
  componentWillUnmount() {
    transaction.removeListener('update:lang', this.handleUpdateLang)
  }
  componentDidUpdate(oldProps, oldState) {
    const list = this.idList
    if (list[this.state.index] !== oldProps.id[oldState.index]) {
      this.handleUpdateLang(this.lang)
      this.props.onActiveUpdate(
        list[this.state.index],
        oldProps.id[oldState.index]
      )
    }
  }

  get srcList() {
    if (Array.isArray(this.props.id)) {
      return this.props.source
    }
    return [this.props.source]
  }
  get argsList() {
    if (Array.isArray(this.props.id)) {
      return this.props.args
    }
    return [this.props.args]
  }
  get idList() {
    if (Array.isArray(this.props.id)) {
      return this.props.id
    }
    return [this.props.id]
  }
  get rawList() {
    if (Array.isArray(this.props.id)) {
      return this.props.raw
    }
    return [this.props.raw]
  }

  onSave = async evt => {
    if (this.props.onSave) {
      const { value, index } = this.state
      const data = {
        value: value[index],
        data: {
          id: this.idList[index],
          args: this.argsList[index],
          raw: this.argsList[index],
          src: this.srcList[index]
        }
      }
      this.setState({ fetching: true })
      try {
        await this.props.onSave(data)
      } finally {
        this.setState({ fetching: false })
      }
    }
  }

  get lang() {
    return transaction.context.lang.replace(/_/g, '-')
  }

  close = () => {
    this.props.onClose && this.props.onClose()
    close()
  }

  render() {
    const { index, value } = this.state
    const { idList, argsList, rawList } = this

    return (
      <div>
        <Header onClose={this.close}>i18n Edit Live</Header>
        <Body>
          <div className="i18n-lang-context">
            <button
              disabled={this.lang === 'en-US'}
              className="i18n-modal-btn sm"
              onClick={() => {
                transaction.register('en-US')
                this.forceUpdate()
              }}
            >
              en-US
            </button>
            <button
              className="i18n-modal-btn sm"
              disabled={this.lang === 'zh-CN'}
              onClick={() => {
                transaction.register('zh-CN')
                this.forceUpdate()
              }}
            >
              zh-CN
            </button>
          </div>
          <div className={bodyPrefix + 'info'}>
            <div className={bodyPrefix + 'logo'}>i18n Edit Live</div>

            <div className={bodyPrefix + 'key'}>
              <span>Key: </span>
              <span>{idList[index]}</span>
            </div>
            {this.srcList[index] && (
              <div className={bodyPrefix + 'key'}>
                <span>Src: </span>
                <span>{this.srcList[index]}</span>
              </div>
            )}
            {argsList[index] &&
              !!argsList[index].length && (
                <div className={bodyPrefix + 'key'}>
                  Arguments: {`[${argsList[index].join(', ')}]`}
                </div>
              )}
            <div className={bodyPrefix + 'raw'}>{rawList[index]}</div>
          </div>
          <Sep />
          <textarea
            autoFocus={true}
            value={value[index]}
            onKeyDown={async evt => {
              // Ctrl/Cmd + S
              if (
                (evt.ctrlKey || evt.metaKey) &&
                evt.keyCode === 'S'.charCodeAt(0)
              ) {
                evt.preventDefault()
                evt.stopPropagation()
                await this.onSave()
                return
              }
              // Ctrl/Cmd + ]
              if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === 221) {
                this.close()
                evt.preventDefault()
                evt.stopPropagation()
                return
              }
            }}
            onChange={evt => {
              const newValues = value.slice()
              newValues[index] = evt.target.value
              this.setState({ value: newValues })
              this.props.updateValue && this.props.updateValue(newValues)
            }}
            rows={4}
            className={bodyPrefix + 'edit'}
            placeholder="Enter translation here"
          />
        </Body>
        <Footer>
          <span className="">
            <button
              className="i18n-modal-btn i18n-icon-left"
              title={'previous'}
              onClick={() => {
                this.setState({
                  index: this.state.index - 1
                })
              }}
              disabled={this.state.index <= 0}
            >
              {'<'}
            </button>
            <button
              className="i18n-modal-btn i18n-icon-right"
              title={'next'}
              onClick={() => {
                this.setState({
                  index: this.state.index + 1
                })
              }}
              disabled={this.state.index >= this.idList.length - 1}
            >
              {'>'}
            </button>
          </span>
          <span className="i18n-right">
            <span>{`${index + 1}/${idList.length}`}</span>
            <button
              disabled={
                this.state.fetching ||
                !value[index] ||
                value[index] === rawList[index]
              }
              className={'i18n-modal-btn'}
              onClick={this.onSave}
            >
              Save
            </button>
          </span>
        </Footer>
      </div>
    )
  }
}
