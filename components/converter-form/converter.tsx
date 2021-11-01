import React from 'react'
import { Control } from '../input/control'
import css from './converter.module.scss'
import { CurrencySelect } from '../currency-select/currency-select'
import { Currency, CurrencySheet } from 'interfaces/currency.interface'

interface IState {
  sourceValue: number
  resultValue: number
  targetCurrency: Currency
  sourceCurrency: Currency
  isLoading: boolean
}

export class Converter extends React.Component<{}, IState> {
  private _currencyMap: Map<string, number>;
  private _sheet: CurrencySheet;

  constructor(props) {
    super(props)
    this.state = {
      sourceValue: 0,
      resultValue: 0,
      sourceCurrency: Currency.USD,
      targetCurrency: Currency.RUB,
      isLoading: true
    }
  }

  async componentDidMount() {
    const apiResponse = await fetch(`/api/currencies`)
    this._sheet = await apiResponse.json()
    this._currencyMap = new Map(Object.entries(this._sheet))
    this.stopLoading()
  }

  convert(updatedValue: number): void {
    this.setState({
      sourceValue: updatedValue,
      resultValue: this._convert(updatedValue, this.state.sourceCurrency, this.state.targetCurrency)
    })
  }

  setCurrency(updatedCurrency: Currency): void {
    const sourceValue = this.state.sourceValue
    this.setState({
      sourceValue,
      targetCurrency: updatedCurrency,
      resultValue: this._convert(sourceValue, this.state.sourceCurrency, updatedCurrency),
    })
  }

  setSourceCurrency(updatedCurrency: Currency): void {
    const sourceValue = this.state.sourceValue
    let targetCurrency = this.state.targetCurrency
    if (targetCurrency === updatedCurrency) {
      targetCurrency = this.state.sourceCurrency
    }
    this.setState({
      sourceValue,
      sourceCurrency: updatedCurrency,
      resultValue: this._convert(sourceValue, updatedCurrency, targetCurrency),
      targetCurrency
    })
  }

  stopLoading(): void {
    this.setState({ isLoading: false });
  }

  private _convert(value: number, from: Currency, to: Currency): number {
    const usdValue = value / this._currencyMap.get(from);
    return usdValue * this._currencyMap.get(to);
  }

  private _renderForm() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <div className={css.FormWrap}>
          <div className={css.FormGroup}>
            <Control value={this.state.sourceValue} onChange={e => this.convert(e)} />
            <CurrencySelect value={this.state.sourceCurrency} onChange={c => this.setSourceCurrency(c)} />
          </div>
          <div className={css.FormGroup}>
            <output className={css.FormOutput}>{this.state.resultValue.toFixed(2)}</output>
            <CurrencySelect excludedCurrencies={[this.state.sourceCurrency]} value={this.state.targetCurrency} onChange={c => this.setCurrency(c)} />
          </div>
        </div>
      </form>
    )
  }

  private _renderPreloader() {
    return (<div>
      Loading now
    </div>)
  }

  render() {
    return this.state.isLoading ? this._renderPreloader() : this._renderForm()
  }
}
