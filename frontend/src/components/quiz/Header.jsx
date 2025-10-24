export default function Header() {
    return (
        <header className="p-5 flex items-center border-b-2 border-gray-400 mb-15">
            <button className="text-xl">{"<"}</button>
            <h2 className="flex-1 text-center font-bold text-xl">
                Science & Technology Quiz
            </h2>
            <img src="logo.png" alt="logo" className="h-10" />
        </header>
    );
}