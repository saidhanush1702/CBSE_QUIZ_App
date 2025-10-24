export default function OptionButton({
    id,
    text,
    onSelect,
    selected,
    correct,
    wrong,
    disabled
}) {
    let style = "bg-[#47C3FF]";

    if (selected) style = "bg-blue-600";
    if (correct) style = "bg-green-500";
    if (wrong) style = "bg-red-500";

    return (
        <button
            disabled={disabled}
            className={`w-[44%] py-4 px-4 rounded-xl text-white text-lg font-medium mb-4 transition-colors duration-200
        ${style} ${disabled && "opacity-75 cursor-not-allowed"}`}
            onClick={() => onSelect(id)}
        >
            {id}. {text}
        </button>
    );
}