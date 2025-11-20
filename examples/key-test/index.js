import Yoramework from "../../src/index.js";

function KeyTest() {
    const [items, setItems] = Yoramework.useState([
        { id: 1, text: "Item 1" },
        { id: 2, text: "Item 2" },
        { id: 3, text: "Item 3" },
    ]);

    const shuffle = () => {
        const newItems = [...items];
        for (let i = newItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
        }
        setItems(newItems);
    };

    const addItem = () => {
        const id = Date.now();
        setItems([...items, { id, text: `Item ${id}` }]);
    };

    const removeItem = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };

    return (
        <div>
            <h1>Keyed Reconciliation Test</h1>
            <p>Type something in the inputs, then shuffle. If keys work, the text should stay with the item.</p>
            <div style={{ marginBottom: "20px" }}>
                <button onClick={shuffle}>Shuffle</button>
                <button onClick={addItem}>Add Item</button>
            </div>
            <ul>
                {items.map((item) => (
                    <li key={item.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc" }}>
                        <strong>{item.text}</strong>
                        <input placeholder="Type here..." style={{ marginLeft: "10px" }} />
                        <button onClick={() => removeItem(item.id)} style={{ marginLeft: "10px" }}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

Yoramework.render(<KeyTest />, document.getElementById("root"));
