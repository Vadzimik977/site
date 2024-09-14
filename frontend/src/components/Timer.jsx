import moment from 'moment'
import CountDown from 'react-countdown';

export default function Timer() {
    const end = moment().endOf('day');
    const renderFn = ({ hours, minutes, seconds, completed })  => (
        <>
            <span className="hours">{hours}</span> :{" "}
            <span className="minutes">{minutes}</span> :{" "}
            <span className="seconds">{seconds}</span> 
        </>
    )
    return (
        <>
            <CountDown date={end} renderer={renderFn} /> 
        </>
    )
}