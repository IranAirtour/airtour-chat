import React, {useCallback, useEffect, useMemo, useState} from 'react';
import FileViewer from 'react-native-file-viewer';
import {FetchBlobClient} from 'airtour-components/src/utils/FetchBlob';
import {ToastHandlerClient} from 'airtour-components/src/utils/Toast';
import {PermissionHandlerClient} from 'airtour-components/src/utils/PermissionHandler';
import {FileViewerClient} from 'airtour-components/src/utils/FileViewer';
import {logWarn} from 'airtour-components/src/utils/Logger';

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
  DOWNLOAD_FAILED: {icon: 'reload'},
};

export const useDownloadFileHook = (props: any) => {
  const [taskId, setTaskId] = React.useState<NullableString>(null);
  const [downloadProgress, setDownloadProgress] = useState<NullableNumber>(100);
  const {file, addDownloadedAttachment} = props ?? {};
  const [fileStatus, setFileStatus] = useState<IFileStatus>(
    IFileResource.NOT_EXISTED,
  );
  const {id: attachmentId, name, type, mimeType, size} = file ?? {};

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
    logWarn(pathToFile, 'AttachmentId');
    requestStoragePermissions();
    if (fileStatus === IFileResource.EXISTED) {
      openFile(pathToFile);
    } else {
      downloadFile();
    }
    // isFileExists(pathToFile).then(isExist => {
    //   if (isExist) {
    //     openFile(pathToFile);
    //   } else {
    //     downloadFile();
    //   }
    // });
  }, [pathToFile, fileStatus]);

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
      if (fileStatus === IFileResource.EXISTED) {
        FileViewerClient.openFile(fileToOpen || pathToFile).catch(() => {
          ToastHandlerClient.show('format denied');
        });
      }
    },
    [pathToFile, fileStatus],
  );

  const downloadFile = useCallback(() => {
    setFileStatus(IFileResource.DOWNLOADING);
    if (taskId) {
      FetchBlobClient.cancelTask(taskId);
      setFileStatus(IFileResource.NOT_EXISTED);
      setTaskId(null);
      return;
    } else {
      FetchBlobClient.downloadManager(
        {
          url: file?.thumbnailUrl ?? '',
        },
        {
          fileName: attachmentId,
          // fileName: name,
          mimeType: (mimeType || type || 'txt') as string,
          pathToDownload: pathToFile,
          fileSize: size,
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
          addDownloadedAttachment(attachmentId);
          setFileStatus(IFileResource.EXISTED);
          // openFile(file?.path() || file?.data);
        })
        .catch(e => {
          if (e?.toString().includes('canceled')) {
            setFileStatus(IFileResource.NOT_EXISTED);
          } else {
            setFileStatus(IFileResource.DOWNLOAD_FAILED);
          }
          FetchBlobClient.deleteFile(pathToFile);
        })
        .finally(() => {
          setTaskId(null);
          setDownloadProgress(null);
        });
    }
  }, [taskId]);

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
