import './LoadingScreen.component.scss';

interface LoadingScreenProps {
  fadeOut?: boolean;
}

const LoadingScreen = ({ fadeOut = false }: LoadingScreenProps) => {
    return (
        <div className={`loading-container${fadeOut ? " fade-out" : ""} special-background`}>
            <div className="simpl-fade poppins">
                Simpl
            </div>
        </div>
    );
}

export default LoadingScreen;