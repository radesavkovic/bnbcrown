import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import classNames from "classnames";

import styles from "./CustomModal.module.scss";

const CustomModal = (props) => {
  const { children, className, title, visible, width, onCancel, ...rest } =
    props;
  return (
    <Modal
      wrapClassName={classNames(styles.CustomModal, className)}
      visible={visible}
      width={width}
      onCancel={onCancel}
      destroyOnClose
      centered
      closable={false}
      footer={null}
      {...rest}
    >
      <div className={styles.titleWrap}>
        <h2>{title}</h2>
        <img
          src="/static/images/icons/close.svg"
          alt="close"
          onClick={onCancel}
        />
      </div>
      {children}
    </Modal>
  );
};

CustomModal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.number,
};

CustomModal.defaultProps = {
  children: null,
  className: "",
  title: "",
  visible: false,
  width: 450,
};

export default CustomModal;
