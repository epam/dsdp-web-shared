import ConfirmModal from '#web-components/components/ConfirmModal';

import React, {
  useCallback, useState,
} from 'react';
import { useBlocker, useLocation, useNavigate } from 'react-router';

export type RouterPromptProps = {
  title: string,
  okText: string,
  cancelText: string,
  enabled: boolean,
  text: string,
  baseName: string,
};

export default function RouterPrompt({
  title, okText, cancelText, enabled, text, baseName,
}: RouterPromptProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [shouldGoBack, setShouldGoBack] = useState(false);
  const blocker = useBlocker(({ nextLocation }) => {
    if (!enabled) {
      return false;
    }
    const fullRouterPathName = baseName.concat(location.pathname).concat(location.search);
    const fullWindowPathName = window.location.pathname.concat(window.location.search);
    const isBackButtonClick = fullWindowPathName !== fullRouterPathName;

    if (nextLocation.state?.forceLeave && !isBackButtonClick) {
      return false;
    }

    setCurrentPath(nextLocation.pathname.concat(nextLocation.search));
    setShowPrompt(true);

    // on browser back button clicked, actual browser url changed
    // so we have to change it back
    if (isBackButtonClick) {
      setShouldGoBack(true);
      window.history.forward();
    }
    // for block router, here we have to return some non empty string
    return true;
  });

  const handleOK = useCallback(() => {
    blocker.proceed?.();
    setShowPrompt(false);
    if (shouldGoBack) {
      navigate(-1);
    } else {
      navigate(currentPath);
    }
  }, [blocker, currentPath, navigate, shouldGoBack]);

  const handleCancel = useCallback(async () => {
    setShowPrompt(false);
    setShouldGoBack(false);
  }, []);

  return showPrompt ? (
    <ConfirmModal
      title={title}
      isOpen={showPrompt}
      onSubmit={handleOK}
      submitText={okText}
      onOpenChange={handleCancel}
      cancelText={cancelText}
      confirmationText={text}
    />
  ) : null;
}
