import './Button.css'

type ButtonProps = {
    text: string,
    onClick: () => void,
    style?: 'primary' | 'secondary', 
}

const Button = (props: ButtonProps) => {
    const {
        text,
        onClick,
        style = 'primary',
    } = props

    return (
        <button onClick={onClick} className={`button ${style === 'secondary'? 'button_secondary': ''}`}>
            {text}
        </button>
    )
}

export {
    Button,
}