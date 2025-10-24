export default function ProgressBar({ current, total }) {
    const width = (current / total) * 100;

    return (
        <div className="mx-10">
            <div className="w-full h-1.5 bg-gray-300 rounded-full">
                <div
                    className="h-full bg-[#8000ff] rounded-full transition-all"
                    style={{ width: `${width}%` }}
                />
            </div>
            <p className="text-sm mt-1 text-gray-700">
                {current} of {total} Complete
            </p>
        </div>
    );
}