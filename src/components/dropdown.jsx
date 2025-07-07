function Dropdown({resetGame, difficulty, setDifficulty}) {

    return (
        <select value={difficulty} onChange={(e)=>{setDifficulty(e.target.value);resetGame()}} className="text-white p-2 mb-4 border rounded">
            <option value="easy" className="text-yellow-300">Easy</option>
            <option value="medium" className="text-orange-400">Medium</option>
            <option value="hard" className="text-red-600">Hard</option>
        </select>
    );
}

export default Dropdown;