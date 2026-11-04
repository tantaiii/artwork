import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import '../../css/Package.css';
import React from 'react';
function PremiumTypography({pack}) {
  return (
    <div className="premium-typography">
      <FontAwesomeIcon icon={faCrown} className="crown-icon"/>
      <h3 className="gradient-text">
       {pack?.packageID===1?"Upgrade To Premium":`Premium Account`}
        </h3>
    </div>
  );
}
export default PremiumTypography;