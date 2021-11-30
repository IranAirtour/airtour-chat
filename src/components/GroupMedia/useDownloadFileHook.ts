import React, {useCallback, useEffect, useMemo, useState} from 'react';
import FileViewer from 'react-native-file-viewer';
import {MessageFactory} from '../../Factory/Message';
import {useAppDispatch} from '../../redux/store';
import {addDownloadedAttachment} from '../../redux/slices/groupSlice';
import {FetchBlobClient} from 'airtour-components/src/utils/FetchBlob';
import {ToastHandlerClient} from 'airtour-components/src/utils/Toast';
import {PermissionHandlerClient} from 'airtour-components/src/utils/PermissionHandler';
import {IServerAttachment} from '../../model/ApiModels/Message';

type NullableString = string | null;
type NullableNumber = number | null;

interface IFileStatus {
  color?: string;
  icon?: string;
  status?: number;
}

const IFileResource = {
  NOT_EXISTED: {color: '#1CA35A', icon: 'download-outline'},
  EXISTED: {color: '#7879F1', icon: 'checkmark'},
  DOWNLOADING: {color: '#F178B6', icon: ''},
};

export const useDownloadFileHook = (props: any) => {
  const dispatch = useAppDispatch();
  const [taskId, setTaskId] = React.useState<NullableString>(null);
  const [downloadProgress, setDownloadProgress] = useState<NullableNumber>(100);
  const {file, baseUrl} = props ?? {};
  const fileUri = MessageFactory.generateAttachmentUrl(
    file as IServerAttachment,
    baseUrl,
  );
  const [fileStatus, setFileStatus] = useState<IFileStatus>(
    IFileResource.NOT_EXISTED,
  );
  const {id: attachmentId, name, type, mimeType} = file ?? {};

  const fullName = (name || '') + '.' + (type || mimeType || '');

  const pathToFile: string = useMemo(
    () =>
      FetchBlobClient.ChatPath + attachmentId + '.' + (type || mimeType || ''),
    [attachmentId],
  );

  useEffect(() => {
    FetchBlobClient.isFileExists(pathToFile).then(isExists => {
      setFileStatus(
        isExists ? IFileResource.EXISTED : IFileResource.NOT_EXISTED,
      );
    });
  }, [pathToFile]);

  const onFilePress = useCallback(() => {
    requestStoragePermissions();
    isFileExists(pathToFile).then(isExist => {
      // logWarn(fullName,pathToFile,fullName)
      if (isExist) {
        openFile(pathToFile);
      } else {
        downloadFile();
      }
    });
  }, [pathToFile, fullName]);

  const requestStoragePermissions = useCallback(async () => {
    try {
      const hasReadStoragePermission =
        await PermissionHandlerClient.hasReadStoragePermission();
      if (!hasReadStoragePermission) {
        await PermissionHandlerClient.requestReadStoragePermission();
      }
    } catch (e) {}
    try {
      const hasWriteStoragePermission =
        await PermissionHandlerClient.hasWriteStoragePermission();
      if (!hasWriteStoragePermission) {
        await PermissionHandlerClient.requestWriteStoragePermission();
      }
    } catch (e) {}
  }, []);

  const isFileExists = useCallback(
    (path: string = pathToFile): Promise<boolean> => {
      return FetchBlobClient.isFileExists(path);
    },
    [pathToFile],
  );

  const openFile = useCallback(
    fileToOpen => {
      FileViewer.open(fileToOpen || pathToFile).catch(() => {
        ToastHandlerClient.show('format denied');
      });
    },
    [pathToFile],
  );

  const downloadFile = useCallback(() => {
    setFileStatus(IFileResource.DOWNLOADING);
    if (taskId) {
      FetchBlobClient.cancelTask(taskId);
      setTaskId(null);
      return;
    } else {
      FetchBlobClient.downloadManager(
        {
          url: fileUri,
        },
        {
          fileName: attachmentId,
          // fileName: name,
          mimeType: (mimeType || type || 'txt') as string,
        },
        (percent: number) => {
          setDownloadProgress(percent);
          setFileStatus(IFileResource.DOWNLOADING);
        },
        id => {
          // alert(id);
          setTaskId(id);
        },
      )
        .then(file => {
          dispatch(addDownloadedAttachment(attachmentId));
          setFileStatus(IFileResource.EXISTED);
          openFile(file?.path() || file?.data);
        })
        .catch(e => {
          setFileStatus(IFileResource.NOT_EXISTED);
        })
        .finally(() => {
          setTaskId(null);
          setDownloadProgress(null);
        });
    }
  }, [taskId, fileUri]);

  const useDownloadFileProvider = () => {
    return {
      onFilePress,
      downloadProgress,
      downloadTaskId: taskId,
      fileStatus,
      isFileExists,
    };
  };
  return useDownloadFileProvider();
};
