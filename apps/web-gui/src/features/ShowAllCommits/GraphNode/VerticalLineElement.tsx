export type VerticalLineType = "None" | "Full" | "TopHalf" | "BottomHalf";
export function VerticalLineElement(props: { type: VerticalLineType; strokeWidth: number; }) {

    if (props.type === "None")
        return null;

    const strokeWidth = props.strokeWidth;
    const color = "red";

    let y: number = 0;
    let rectHeight: number = 0;

    if (props.type === "Full") {
        y = 0;
        rectHeight = 100;
    }

    if (props.type === "TopHalf") {
        y = 0;
        rectHeight = 50;
    }

    if (props.type === "BottomHalf") {
        y = 50;
        rectHeight = 50;
    }

    return (
        <svg
            viewBox="0 0 100 100" // Make it responsive
            preserveAspectRatio="none" // Stretches and distorts the rect to fill the entire svg
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-full max-w-full h-full"
        >
            <rect
                x={50 - strokeWidth / 2}
                y={y}
                width={strokeWidth}
                height={rectHeight}
                fill={color} />
        </svg>
    );
}
