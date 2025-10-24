export default function FooterNav({ onNext }) {
    return (
        <div className="flex justify-between px-10">
            <button
                className="bg-[#ADD8FF] text-[#2f247f] font-semibold py-3 px-6 rounded-xl"
                onClick={onNext}
            >
                Skip
            </button>
            <button
                className="bg-[#7E2AF6] text-white font-semibold py-3 px-6 rounded-xl"
                onClick={onNext}
            >
                Next Question →
            </button>
        </div>
    );
}