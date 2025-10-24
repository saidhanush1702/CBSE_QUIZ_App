export default function FooterNav({ onNext }) {
    return (
        <div className="flex justify-end p-6">
            <button
                className="bg-[#7E2AF6] text-white font-semibold py-3 px-6 rounded-xl"
                onClick={onNext}
            >
                Next Question →
            </button>
        </div>
    );
}