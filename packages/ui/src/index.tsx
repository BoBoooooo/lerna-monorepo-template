import React from 'react';
import Component from '@namespace/components';
import './styles/index.less';

export default ()=>{
    return (
        <div className="ui-wrapper">
            <div className="ui-wrapper-ui-text">I am @namespace/ui</div>
            <Component />
        </div>
    );
};