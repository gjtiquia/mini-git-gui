export type CenterType = "None" | "Circle" | "RoundedCorner";

export function CenterElement(props: { type: CenterType; strokeWidth: number; }) {
    if (props.type === "Circle")
        return <Circle radius={28} />;

    if (props.type === "RoundedCorner")
        return <Circle radius={props.strokeWidth / 2} />;

    return null;
}

function Circle(props: { radius: number; }) {

    const radius = Math.min(props.radius, 50); // Max radius is 50, because view box is 100
    const color = "red";

    return (
        <svg
            viewBox="0 0 100 100" // Shift origin from top left to center + Make it responsive
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-full max-w-full"
        >
            <circle cx="50" cy="50" r={radius} fill={color} />
        </svg>
    );
}
