export type HorizontalLineType = "None" | "LeftHalf" | "RightHalf";
export function HorizontalLineElement(props: { type: HorizontalLineType; strokeWidth: number; }) {

    if (props.type === "None")
        return null;

    const strokeWidth = props.strokeWidth;
    const color = "red";

    let x: number = 0;
    let rectWidth: number = 0;

    if (props.type === "LeftHalf") {
        x = 0;
        rectWidth = 50;
    }

    if (props.type === "RightHalf") {
        x = 50;
        rectWidth = 50;
    }

    return (
        <svg
            viewBox="0 0 100 100" // Make it responsive
            xmlns="http://www.w3.org/2000/svg"
            className="min-w-full max-w-full h-full"
        >
            <rect
                x={x}
                y={50 - strokeWidth / 2}
                width={rectWidth}
                height={strokeWidth}
                fill={color} />
        </svg>
    );
}
