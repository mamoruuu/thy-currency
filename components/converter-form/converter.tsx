import React from 'react'
import { Control } from '../input/control'
import css from './converter.module.scss'
import { CurrencySelect } from '../currency-select/currency-select'
import { Currency, CurrencySheet } from 'interfaces/currency.interface'
import { ArrowLeftRight } from 'react-bootstrap-icons'

interface IState {
  currencyControls: IFormControl[]
}

type IFormControl = [number, Currency]

interface IProps {
  sheet: CurrencySheet;
}

export class Converter extends React.Component<IProps, IState> {
  private _currencyMap: Map<string, number>;

  constructor(props: IProps) {
    super(props)
    this.state = {
      currencyControls: [
        [0, Currency.USD],
        [0, Currency.RUB],
      ],
    }
    this._currencyMap = new Map(Object.entries(this.props.sheet))
  }

  convert(updatedValue: number, index: number): void {
    const controls = [...this.state.currencyControls]
    controls[index][0] = updatedValue
    this.setState({
      currencyControls: this.convertAllControls(index, controls)
    })
  }

  setCurrency(updatedCurrency: Currency, index: number): void {
    const controls = [...this.state.currencyControls]
    controls[index][1] = updatedCurrency
    this.setState({
      currencyControls: this.convertAllControls(index, controls)
    })
  }

  private convertAllControls(changedIndex: number, controls: IFormControl[]): IFormControl[] {
    const [refValue, refCurrency] = controls[changedIndex]

    return controls.map(([, currency]) =>
      [this._convertValue(refValue, refCurrency, currency), currency]
    )
  }

  private _convertValue(value: number, from: Currency, to: Currency): number {
    const usdValue = value / this._currencyMap.get(from);
    return usdValue * this._currencyMap.get(to);
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <div className={css.FormWrap}>
          {this.state.currencyControls.map(([value, currency], index) =>
            [
              <div key={index} className={css.FormGroup}>
                <Control value={value} onChange={e => this.convert(e, index)} />
                <CurrencySelect value={currency} onChange={c => this.setCurrency(c, index)} />
              </div>
              ,
              this.state.currencyControls.length !== index + 1 && <ArrowLeftRight size={48} className={css.Arrow} />
            ]
          )}
        </div>
      </form>
    )
  }
}
