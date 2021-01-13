import React, { useState, useEffect } from 'react';
import { Paper, Toolbar, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';

import styles from './Chat.module.css';
import { Simulator } from '../../components/simulator/Simulator';
import ChatMessages from './ChatMessages/ChatMessages';
import ChatConversations from './ChatConversations/ChatConversations';
import Loading from '../../components/UI/Layout/Loading/Loading';
import { SEARCH_QUERY } from '../../graphql/queries/Search';
import { setErrorMessage } from '../../common/notification';
import { getUserRole } from '../../context/role';
import { SEARCH_QUERY_VARIABLES, SIMULATOR_CONTACT } from '../../common/constants';
import selectedChatIcon from '../../assets/images/icons/Chat/Selected.svg';
import CollectionConversations from './CollectionConversations/CollectionConversations';

export interface ChatProps {
  contactId?: number | string | null;
  groupId?: number | null;
}

export const Chat: React.SFC<ChatProps> = ({ contactId, groupId }) => {
  const [simulatorAccess, setSimulatorAccess] = useState(true);
  const [showSimulator, setShowSimulator] = useState(false);
  const [selectedTab, setSelectedTab] = useState('contacts');

  let selectedContactId = contactId;
  let selectedGroupId = groupId;

  let simulatorId: string | null = null;

  // default queryvariables
  const queryVariables = SEARCH_QUERY_VARIABLES;

  // contact id === group when the group id is not passed in the url
  if (selectedGroupId || selectedContactId === 'group') {
    queryVariables.filter = { searchGroup: true };
  }

  // fetch the conversations from cache
  const { loading, error, data, client } = useQuery<any>(SEARCH_QUERY, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (getUserRole().includes('Staff')) {
      setSimulatorAccess(false);
    }
  }, []);

  if (loading) return <Loading />;
  if (error) {
    setErrorMessage(client, error);
    return null;
  }

  console.log('chat.ts data', data);

  // let's handle the case when group id is not passed in the url then we set the first group
  // as the selected group
  if (!selectedGroupId && selectedContactId === 'group' && data && data.search.length !== 0) {
    selectedGroupId = data.search[0].group.id;
    selectedContactId = '';
  }

  // let's handle the case when contact id and group id is not passed in the url then we set the
  // first record as selected contact
  if (!selectedContactId && !selectedGroupId && data && data.search.length !== 0) {
    selectedContactId = data.search[0].contact.id;
  }

  const handleTabClick = (tab: string) => {
    console.log('chat.ts selected tab', tab);
    const refetchVariables = SEARCH_QUERY_VARIABLES;
    if (tab === 'groups') {
      refetchVariables.filter = { searchGroup: true };
    } else {
      refetchVariables.filter = {};
    }

    console.log('chat.ts refetchVariables', refetchVariables);
    // refetch({ variables: refetchVariables });
    console.log('chat.ts after data refetch', data);
    setSelectedTab(tab);
  };

  let chatInterface: any;
  if (data && data.search.length === 0) {
    chatInterface = (
      <Typography variant="h5" className={styles.NoConversations}>
        There are no chat conversations to display.
      </Typography>
    );
  } else {
    let listingContent;
    let contactSelectedClass = '';
    let groupSelectedClass = '';
    console.log('chat.ts selectedGroupId', selectedGroupId);
    console.log('chat.ts contactid', selectedContactId);
    if (selectedGroupId || selectedTab === 'groups') {
      listingContent = <CollectionConversations groupId={selectedGroupId} />;
      // listingContent = <div>Hello</div>;
      // set class for groups tab
      groupSelectedClass = `${styles.SelectedTab}`;
    } else if (selectedContactId) {
      // let's enable simulator only when contact tab is shown
      const simulatedContact = data.search.filter(
        (item: any) => item.contact.phone === SIMULATOR_CONTACT
      );
      if (simulatedContact.length > 0) {
        simulatorId = simulatedContact[0].contact.id;
      }

      listingContent = (
        <ChatConversations
          contactId={showSimulator && simulatorId ? Number(simulatorId) : selectedContactId}
          simulator={{ simulatorId, setShowSimulator }}
        />
      );

      // set class for contacts tab
      contactSelectedClass = `${styles.SelectedTab}`;
    }

    chatInterface = (
      <>
        <div className={`${styles.ChatMessages} chatMessages`}>
          <ChatMessages
            contactId={showSimulator && simulatorId ? simulatorId : selectedContactId}
            simulatorId={simulatorId}
            groupId={selectedGroupId}
          />
        </div>

        <div className={`${styles.ChatConversations} chatConversations`}>
          <Toolbar className={styles.ToolBar}>
            <div className={styles.IconBackground}>
              <img src={selectedChatIcon} height="24" className={styles.Icon} alt="Conversation" />
            </div>
            <div className={styles.TabContainer}>
              <div
                className={styles.Title}
                aria-hidden="true"
                onClick={() => handleTabClick('contacts')}
                onKeyDown={() => handleTabClick('contacts')}
              >
                <Typography className={`${styles.TitleText} ${contactSelectedClass}`} variant="h6">
                  Contacts
                </Typography>
              </div>
              <div
                className={styles.Title}
                aria-hidden="true"
                onClick={() => handleTabClick('groups')}
                onKeyDown={() => handleTabClick('groups')}
              >
                <Typography className={`${styles.TitleText} ${groupSelectedClass}`} variant="h6">
                  Groups
                </Typography>
              </div>
            </div>
          </Toolbar>

          <div>{listingContent}</div>
        </div>
      </>
    );
  }

  return (
    <Paper>
      <div className={styles.Chat} data-testid="chatContainer">
        {chatInterface}
      </div>
      {simulatorAccess && !selectedGroupId ? (
        <Simulator setShowSimulator={setShowSimulator} showSimulator={showSimulator} />
      ) : null}
    </Paper>
  );
};
