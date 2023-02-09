import React from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

const Button = (props) => {
  const { children, className, onClick, disabled, blue } = props;
  return (
    <div
      className={classNames(
        styles.Button,
        className,
        {
          [styles.disabled]: disabled,
        },
        { [styles.blue]: blue }
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Button.defaultProps = { onClick: () => {} };

export default Button;
