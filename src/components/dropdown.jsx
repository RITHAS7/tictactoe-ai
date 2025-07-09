function Dropdown({resetGame, difficulty, setDifficulty}) {

    return (
        <select value={difficulty} onChange={(e)=>{setDifficulty(e.target.value);resetGame(e.target.value)}} className="text-white p-2 mb-4 border rounded">
            <option value="two" className="text-green-500">2 Player</option>
            <option value="easy" className="text-yellow-300">Easy AI</option>
            <option value="medium" className="text-orange-400">Medium AI</option>
            <option value="hard" className="text-red-600">Unbeatable AI</option>
        </select>
    );
}

export default Dropdown;