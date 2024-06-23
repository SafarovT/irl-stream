import './Button.css'

type ButtonProps = {
    text: string,
    onClick: () => void,
}

const Button = (props: ButtonProps) => {
    const {
        text,
        onClick,
    } = props

    return (
        <button onClick={onClick} className="button">
            {text}
        </button>
    )
}

export {
    Button,
}