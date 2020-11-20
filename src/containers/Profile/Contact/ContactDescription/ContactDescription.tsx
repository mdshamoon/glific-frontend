import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import styles from './ContactDescription.module.css';
import { Timer } from '../../../../components/UI/Timer/Timer';

export interface ContactDescriptionProps {
  fields: any;
  settings: any;
  phone: string;
  maskedPhone: string;
  groups: any;
  lastMessage: string;
}

export const ContactDescription: React.FC<ContactDescriptionProps> = (props) => {
  const { phone, maskedPhone, groups, lastMessage } = props;
  let { fields, settings } = props;

  const [showPlainPhone, setShowPlainPhone] = useState(false);

  // list of groups that the contact is assigned
  let assignedToGroup: any = Array.from(
    new Set([].concat(...groups.map((group: any) => group.users.map((user: any) => user.name))))
  );

  if (assignedToGroup.length > 2) {
    assignedToGroup = `${assignedToGroup.slice(0, 2).join(', ')} +${(
      assignedToGroup.length - 2
    ).toString()}`;
  } else {
    assignedToGroup = assignedToGroup.join(', ');
  }

  // list of groups that the contact belongs
  const groupList = groups.map((group: any) => group.label).join(', ');

  const groupDetails = [
    { label: 'Groups', value: groupList || 'None' },
    {
      label: 'Assigned to',
      value: assignedToGroup || 'None',
    },
  ];

  if (typeof settings === 'string') {
    settings = JSON.parse(settings);
  }

  if (typeof fields === 'string') {
    fields = JSON.parse(fields);
  }

  const handlePhoneDisplay = () => {
    setShowPlainPhone(!showPlainPhone);
  };

  let phoneDisplay = <span data-testid="phone">+{maskedPhone}</span>;
  if (phone) {
    if (showPlainPhone) {
      phoneDisplay = (
        <div>
          <span data-testid="phone">+{phone}</span>
          <IconButton
            aria-label="toggle phone visibility"
            data-testid="phoneToggle"
            onClick={handlePhoneDisplay}
            edge="end"
          >
            <VisibilityOff classes={{ root: styles.Visibility }} />
          </IconButton>
        </div>
      );
    } else {
      phoneDisplay = (
        <div>
          <span data-testid="phone">+{maskedPhone}</span>
          <IconButton
            aria-label="toggle phone visibility"
            data-testid="phoneToggle"
            onClick={handlePhoneDisplay}
            edge="end"
          >
            <Visibility classes={{ root: styles.Visibility }} />
          </IconButton>
        </div>
      );
    }
  }

  return (
    <div className={styles.DescriptionContainer} data-testid="contactDescription">
      <h2 className={styles.Title}>Details</h2>
      <div className={styles.Description}>
        {phoneDisplay}
        <div className={styles.SessionTimer}>
          <span>Session Timer</span>
          <Timer time={lastMessage} />
        </div>
      </div>

      <div className={styles.DetailBlock}>
        {groupDetails.map((groupItem: any) => (
          <div key={groupItem.label}>
            <div className={styles.DescriptionItem}>{groupItem.label}</div>
            <div className={styles.DescriptionItemValue} data-testid="groups">
              {groupItem.value}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.DetailBlock}>
        {settings &&
          typeof settings === 'object' &&
          Object.keys(settings).map((key) => (
            <div key={key}>
              <div className={styles.DescriptionItem}>{key}</div>
              <div className={styles.DescriptionItemValue}>
                {Object.keys(settings[key])
                  .filter((settingKey) => {
                    return settings[key][settingKey] === true;
                  })
                  .join(', ')}
              </div>
            </div>
          ))}
        {fields &&
          typeof fields === 'object' &&
          Object.keys(fields).map((key) => (
            <div key={key}>
              <div className={styles.DescriptionItem}>
                {fields[key].label ? fields[key].label : key.replace('_', ' ')}
              </div>
              <div className={styles.DescriptionItemValue}>{fields[key].value}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
