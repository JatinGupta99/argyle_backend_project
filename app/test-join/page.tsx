'use client';

import { useManualJoin } from './hooks/useManualJoin';
import { JoinForm } from './components/JoinForm';
import { ActiveSession } from './components/ActiveSession';

export default function TestJoinPage() {
    const {
        roomUrl, setRoomUrl,
        token, setToken,
        userName, setUserName,
        isConnecting,
        ready,
        error,
        callObject,
        connect,
        disconnect
    } = useManualJoin();

    if (ready && callObject) {
        return (
            <ActiveSession
                callObject={callObject}
                roomUrl={roomUrl}
                userName={userName}
                handleDisconnect={disconnect}
            />
        );
    }

    return (
        <JoinForm
            roomUrl={roomUrl}
            setRoomUrl={setRoomUrl}
            token={token}
            setToken={setToken}
            userName={userName}
            setUserName={setUserName}
            handleConnect={connect}
            isConnecting={isConnecting}
            error={error}
        />
    );
}
