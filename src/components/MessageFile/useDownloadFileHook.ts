import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {PermissionHandlerClient} from 'airtour-components/src/utils/PermissionHandler';
import {logWarn} from 'airtour-components/src/utils/Logger';
import {FetchBlobClient} from 'airtour-components/src/utils/FetchBlob';
import {ToastHandlerClient} from 'airtour-components/src/utils/Toast';
import {FileViewerClient} from 'airtour-components/src/utils/FileViewer';

type NullableString = string | null;
type NullableNumber = number | null;

const IFileResource = {
  NOT_EXISTED: {icon: 'download-outline'},
  EXISTED: {icon: 'checkmark'},
  DOWNLOADING: {icon: ''},
  DOWNLOAD_FAILED: {icon: 'reload'},
};

export const useDownloadFileHook = (props: any) => {
  const [taskId, setTaskId] = React.useState<NullableString>(null);
  const [downloadProgress, setDownloadProgress] = useState<NullableNumber>(100);
  const {file} = props?.currentMessage ?? props ?? {};
  const {downloadedFileIds, addDownloadedAttachment} = props;
  const {
    id: attachmentId,
    uri: fileUri,
    name,
    type,
    mimeType,
    size,
  } = file ?? {};
  const [fileStatus, setFileStatus] = useState(IFileResource.NOT_EXISTED);
  const fullName = (name || '') + '.' + (type || mimeType || '');
  // const fullName = (name || '') + '.' + (type || mimeType || '');
  const pathToFile: string = useMemo(
    () =>
      FetchBlobClient.ChatPath + attachmentId + '.' + (type || mimeType || ''),
    [attachmentId],
  );

  const isFileDownloaded = useMemo(() => {
    return downloadedFileIds.hasOwnProperty(attachmentId);
  }, [attachmentId, downloadedFileIds]);

  useEffect(() => {
    FetchBlobClient.isFileExists(pathToFile).then(isExists => {
      setFileStatus(
        isExists ? IFileResource.EXISTED : IFileResource.NOT_EXISTED,
      );
    });
  }, [pathToFile, isFileDownloaded, attachmentId]);

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
    (pathToFile): Promise<boolean> => {
      return FetchBlobClient.isFileExists(pathToFile);
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
          url: fileUri,
        },
        {
          // fileName: attachmentId,
          fileName: attachmentId,
          mimeType: (mimeType || type || 'txt') as string,
          pathToDownload: pathToFile,
          fileSize: size,
        },
        (percent: number) => {
          setDownloadProgress(percent);
          setFileStatus(IFileResource.DOWNLOADING);
        },
        id => {
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
  }, [taskId, fileUri]);

  const useDownloadFileProvider = () => {
    return {
      onFilePress,
      downloadProgress,
      downloadTaskId: taskId,
      fileStatus,
    };
  };
  return useDownloadFileProvider();
};
