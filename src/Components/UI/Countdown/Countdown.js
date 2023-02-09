import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Countdown.module.scss';

const Countdown = (props) => {
  const [timeLeft, setTimeLeft] = useState({
    sec: 0,
    min: 0,
    hour: 0,
    day: 0,
  });
  const { timestamp, className } = props;

  function calculateTimeLeft(endTS) {
    let diff = (+new Date(endTS) - +new Date()) / 1000;
    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeftLocal = {
      year: 0,
      day: 0,
      hour: 0,
      min: 0,
      sec: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= 365.25 * 86400) {
      // 365.25 * 24 * 60 * 60
      timeLeftLocal.year = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeftLocal.year * 365.25 * 86400;
    }
    if (diff >= 86400) {
      // 24 * 60 * 60
      timeLeftLocal.day = Math.floor(diff / 86400);
      diff -= timeLeftLocal.day * 86400;
    }
    if (diff >= 3600) {
      // 60 * 60
      timeLeftLocal.hour = Math.floor(diff / 3600);
      diff -= timeLeftLocal.hour * 3600;
    }
    if (diff >= 60) {
      timeLeftLocal.min = Math.floor(diff / 60);
      diff -= timeLeftLocal.min * 60;
    }
    timeLeftLocal.sec = Math.floor(diff);

    return timeLeftLocal;
  }

  function addLeadingZeros(val) {
    let value = val;
    value = String(value);
    while (value.length < 2) {
      value = `0${value}`;
    }
    return value;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(timestamp));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [timestamp, timeLeft]);

  return (
    <span className={classnames(styles.Countdown, className)}>
      {parseInt(timeLeft.day, 10) > 0 ? (
        <>
          <span className={styles.countdownCol}>{addLeadingZeros(timeLeft.day)}</span>
          <span className={styles.colon}>:</span>
        </>
      ) : null}
      <span className={styles.countdownCol}>{addLeadingZeros(timeLeft.hour)}</span>
      <span className={styles.colon}>:</span>
      <span className={styles.countdownCol}>{addLeadingZeros(timeLeft.min)}</span>
      <span className={styles.colon}>:</span>
      <span className={styles.countdownCol}>{addLeadingZeros(timeLeft.sec)}</span>
    </span>
  );
};

Countdown.propTypes = {
  timestamp: PropTypes.number,
  className: PropTypes.string,
};

Countdown.defaultProps = {
  timestamp: new Date().getTime(),
  className: '',
};

export default Countdown;
