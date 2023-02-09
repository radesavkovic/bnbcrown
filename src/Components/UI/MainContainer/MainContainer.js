import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './MainContainer.module.scss';

const MainContainer = (props) => {
  const { className, children } = props;
  return <div className={classnames(styles.MainContainer, className)}>{children}</div>;
};

MainContainer.propTypes = { className: PropTypes.string, children: PropTypes.node };

MainContainer.defaultProps = {
  className: '',
  children: null,
};

export default MainContainer;
