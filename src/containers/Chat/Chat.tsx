import React, { useState, useEffect } from 'react';
import { Paper, Toolbar, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import styles from './Chat.module.css';
import { Simulator } from '../../components/simulator/Simulator';
import ChatMessages from './ChatMessages/ChatMessages';
import ChatConversations from './ChatConversations/ChatConversations';
import Loading from '../../components/UI/Layout/Loading/Loading';
import { SEARCH_QUERY } from '../../graphql/queries/Search';
import { setErrorMessage } from '../../common/notification';
import { getUserRole } from '../../context/role';
import { COLLECTION_SEARCH_QUERY_VARIABLES, SEARCH_QUERY_VARIABLES } from '../../common/constants';
import selectedChatIcon from '../../assets/images/icons/Chat/Selected.svg';
import CollectionConversations from './CollectionConversations/CollectionConversations';

const noConversations = (
  <Typography variant="h5" className={styles.NoConversations}>
    There are no chat conversations to display.
  </Typography>
);
export interface ChatProps {
  contactId?: number | string | null;
  collectionId?: number | null;
}

export const Chat: React.SFC<ChatProps> = ({ contactId, collectionId }) => {
  const [simulatorAccess, setSimulatorAccess] = useState(true);

  const [simulatorId, setSimulatorId] = useState(0);

  let selectedContactId = contactId;
  let selectedCollectionId = collectionId;

  // default query variables
  let queryVariables = SEARCH_QUERY_VARIABLES;

  // contact id === collection when the collection id is not passed in the url
  let selectedTab = 'contacts';
  if (selectedCollectionId) {
    queryVariables = COLLECTION_SEARCH_QUERY_VARIABLES;
    selectedTab = 'collections';
  }

  // fetch the conversations from cache
  const { loading, error, data, client } = useQuery<any>(SEARCH_QUERY, {
    variables: queryVariables,
    fetchPolicy: 'cache-only',
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

  // let's handle the case when collection id is -1 then we set the first collection
  // as the selected collection
  if (!selectedContactId && selectedCollectionId === -1 && data && data.search.length !== 0) {
    if (data.search[0].group) {
      selectedCollectionId = data.search[0].group.id;
      selectedContactId = '';
    }
  }

  // let's handle the case when contact id and collection id is not passed in the url then we set the
  // first record as selected contact
  if (!selectedContactId && !selectedCollectionId && data && data.search.length !== 0) {
    if (data.search[0].contact) {
      selectedContactId = data.search[0].contact.id;
    }
  }

  let chatInterface: any;
  if (data && data.search.length === 0) {
    chatInterface = noConversations;
  } else {
    let listingContent;
    let contactSelectedClass = '';
    let collectionSelectedClass = '';
    if (selectedCollectionId || selectedTab === 'collections') {
      listingContent = <CollectionConversations collectionId={selectedCollectionId} />;
      // set class for collections tab
      collectionSelectedClass = `${styles.SelectedTab}`;
    } else if (selectedContactId) {
      // let's enable simulator only when contact tab is shown

      listingContent = (
        <ChatConversations contactId={simulatorId > 0 ? simulatorId : selectedContactId} />
      );

      // set class for contacts tab
      contactSelectedClass = `${styles.SelectedTab}`;
    }

    chatInterface = (
      <>
        <div className={`${styles.ChatMessages} chatMessages`}>
          <ChatMessages
            contactId={simulatorId > 0 ? simulatorId : selectedContactId}
            collectionId={selectedCollectionId}
            isSimulator={simulatorId > 0}
          />
        </div>

        <div className={`${styles.ChatConversations} chatConversations`}>
          <Toolbar className={styles.ToolBar}>
            <div className={styles.IconBackground}>
              <img src={selectedChatIcon} height="24" className={styles.Icon} alt="Conversation" />
            </div>
            <div className={styles.TabContainer}>
              <div className={styles.Title}>
                <Typography className={`${styles.TitleText} ${contactSelectedClass}`} variant="h6">
                  <Link to="/chat">Contacts</Link>
                </Typography>
              </div>
              <div className={styles.Title}>
                <Typography
                  className={`${styles.TitleText} ${collectionSelectedClass}`}
                  variant="h6"
                >
                  <Link to="/chat/collection">Collections</Link>
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
      {simulatorAccess && !selectedCollectionId ? (
        <Simulator setSimulatorId={setSimulatorId} showSimulator={simulatorId > 0} />
      ) : null}
    </Paper>
  );
};
