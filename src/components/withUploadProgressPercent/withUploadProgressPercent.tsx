import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {EventRegister} from 'airtour-components/src/utils/EventRegister';
import {FetchBlobClient} from 'airtour-components/src/utils/FetchBlob';

export const withUploadProgressPercent = (C: FC<any>) => {
  return (props: any) => {
    const {taskId} = props;
    const ref = useRef(null);
    const [progress, setProgress] = useState<number>(
      taskId ? FetchBlobClient?.getFileServiceProgress(taskId) : 100,
    );
    const unregisterListener = useCallback(() => {
      EventRegister.removeEventListener(ref.current + '');
      ref.current = null;
    }, [ref]);
    const taskIdRef = useRef(taskId);
    useEffect(() => {
      taskIdRef.current = taskId;
      setProgress(prevProgress => {
        return taskId
          ? FetchBlobClient?.getFileServiceProgress(taskId)
          : prevProgress > 90
          ? 100
          : prevProgress;
      });
    }, [taskId]);
    const uploadListenerCallback = useCallback(
      (data: any) => {
        if (data?.taskId === taskIdRef.current) {
          setProgress(data?.progress);
        }
      },
      [taskIdRef],
    );
    useEffect(() => {
      if (taskId && ref.current === null) {
        // @ts-ignore
        ref.current = EventRegister.addEventListener(
          'upload_progress',
          uploadListenerCallback,
        );
      } else if (!taskId && ref.current) {
        // unregisterListener();
      }
    }, [taskId, ref]);
    useEffect(() => {
      return () => {
        unregisterListener();
      };
    }, []);
    return <C {...props} progress={progress} />;
  };
};
