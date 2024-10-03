/**
 * @typedef ControlProps
 * @prop {number} value
 * @prop {(updatedValue: number) => void} onChange
 *
 * @typedef ControlState 
 * @prop {number} value
 * @prop {number} size
 * @prop {string} stringValue
 */

/**
 * @param {number} value
 * @returns {string}
 */
const stringify = (value) => {
	if (Number.isNaN(value)) {
		return '';
	}
	return value.toFixed(value === Math.trunc(value) ? 0 : 2)
}

/**
 * @param {ControlProps} props
 */
export const Control = props => {
	/** @type {React.FormEventHandler<HTMLInputElement>} */
	const emitChangeEvent = (event) => {
		let inputValue = /** @type {HTMLInputElement} */ (event.target).value

		if (inputValue.startsWith('0')) {
			inputValue = inputValue.slice(1);
		}

		if (inputValue === '') {
			props.onChange?.(0)
			return
		}

		const isEndingWithFloatingPoint = inputValue.endsWith(',') || inputValue.endsWith('.')
		const hasExtraFloatingPoint = /[,\.][0-9]+[,\.]/.test(inputValue)

		if (hasExtraFloatingPoint) {
			return
		}

		if (isEndingWithFloatingPoint) {
			return
		}

		const floatValue = parseFloat(inputValue.replace(',', '.'))
		if (!Number.isNaN(floatValue)) {
			props.onChange(floatValue)
		}
	}

	return (
		<label className="min-w-min">
			<input
				className="appearance-none inherit-bg border-0 border-b-2 border-solid border-transparent font-light p-0 pb-3 inline-block text-right cursor-text w-full focus:border-teal-400 outline-none"
				style={{ minWidth: '3ch', width: `${stringify(props.value).length}ch` }}
				type="number"
				inputMode="decimal"
				value={props.value}
				onInput={e => emitChangeEvent(e)}
			/>
		</label>
	)
}