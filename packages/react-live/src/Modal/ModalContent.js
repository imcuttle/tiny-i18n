/** @jsx this.props.createElement */
/**
 * @file: ModalContent
 * @author: Cuttle Cong
 * @date: 2017/12/20
 * @description:
 */
import React from 'react'
import PropTypes from 'prop-types'
import Modal, { Header, Body, Footer, Sep } from './index'

const bodyPrefix = 'i18n-modal-body-'
export default class ModalContent extends React.Component {
  state = {
    keyList: this.props.keyList,
    argsList: this.props.argsList,
    // translatedList: this.props.translatedList,
    inputValueList: this.props.inputValueList || this.props.translatedList,
    index: this.props.index,
    fetching: false
  }

  static propTypes = {
    transaction: PropTypes.any.isRequired,
    tinyI18n: PropTypes.any.isRequired
  }

  static defaultProps = {
    createElement: React.createElement,
    transaction: null,
    tinyI18n: null,
    keyList: [],
    argsList: [],
    // lang => string[]
    argsGetterList: [],
    // lang => string
    translatedGetterList: [],
    // translatedList: [],
    // inputValueList: [],
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
    const { index, inputValueList } = this.state
    const id = list[index]
    const str = await this.props.transaction.getLangInfo({ id })
    if (typeof str === 'string' && str) {
      const newValue = inputValueList.slice()
      newValue[index] = str
      this.setState({
        inputValueList: newValue
      })
    }
  }

  componentDidMount() {
    this.props.transaction.register(this.lang)

    // this.handleUpdateLang(this.lang)
    this.props.transaction.addListener('update:lang', this.handleUpdateLang)
    const list = this.idList
    this.props.onActiveUpdate(list[this.state.index], null)
  }
  componentWillUnmount() {
    this.props.transaction.removeListener('update:lang', this.handleUpdateLang)
  }
  componentDidUpdate(oldProps, oldState) {
    const list = this.idList
    if (list[this.state.index] !== oldProps.keyList[oldState.index]) {
      this.handleUpdateLang(this.lang)
      this.props.onActiveUpdate(list[this.state.index], oldProps.keyList[oldState.index])
    }
  }

  get argsList() {
    const lang = this.lang
    const { argsGetterList } = this.props
    return argsGetterList.map(getter => getter(lang))
  }
  get idList() {
    return this.state.keyList
  }
  get rawList() {
    const lang = this.lang
    const { translatedGetterList } = this.props
    return translatedGetterList.map(getter => getter(lang))
  }

  onSave = async evt => {
    if (this.props.onSave) {
      const { inputValueList, index } = this.state
      const data = {
        value: inputValueList[index],
        data: {
          id: this.idList[index],
          args: this.argsList[index],
          raw: this.rawList[index]
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
    return this.props.transaction.context.lang || this.props.tinyI18n.getCurrentLanguage()
  }

  close = () => {
    this.props.onClose && this.props.onClose()
    Modal.close()
  }

  render() {
    const { index, inputValueList } = this.state
    const { idList, argsList, rawList } = this

    return (
      <div>
        <Header onClose={this.close}>i18n Edit Live</Header>
        <Body>
          <div className="i18n-lang-context">
            {this.props.tinyI18n.getLanguages().map(lang => {
              return this.props.createElement(
                'button',
                {
                  key: lang,
                  disabled: this.lang === lang,
                  className: 'i18n-modal-btn sm',
                  onClick: () => {
                    this.props.transaction.register(lang)
                    // this.handleUpdateLang(lang)
                    this.forceUpdate()
                  }
                },
                lang
              )
            })}
          </div>
          <div className={bodyPrefix + 'info'}>
            <div className={bodyPrefix + 'logo'}>i18n Edit Live</div>

            <div className={bodyPrefix + 'key'}>
              <span>Key: </span>
              <span>{idList[index]}</span>
            </div>
            <div className={bodyPrefix + 'key'}>
              {!!argsList[index].length ? `Arguments: [${argsList[index].join(', ')}]` : ''}
            </div>
            {/*Avoides highlight (arguments) because of overwriting React.createElement */}
            {<div className={bodyPrefix + 'raw'}>{rawList[index]}</div>}
          </div>
          <Sep />
          <textarea
            autoFocus={true}
            value={inputValueList[index]}
            onKeyDown={async evt => {
              // Ctrl/Cmd + S
              if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === 'S'.charCodeAt(0)) {
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
              const newValues = inputValueList.slice()
              newValues[index] = evt.target.value
              this.setState({ inputValueList: newValues })
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
                !inputValueList[index] ||
                inputValueList[index] === this.props.tinyI18n.getWord(idList[index], this.lang)
              }
              title={'Ctrl/Cmd + S'}
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
