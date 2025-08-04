import { ImageUploadInfo } from "@/apis/information/informationType";

/**
 * S3에 이미지 업로드
 * @param file - 업로드할 파일
 * @param uploadInfo - preSignedUrl과 imgName이 포함된 업로드 정보
 * @returns 업로드 성공 여부
 */
export const uploadToS3 = async (file: File, uploadInfo: ImageUploadInfo): Promise<boolean> => {
  try {
    const { preSignedUrl, imgName } = uploadInfo;

    // PUT 요청으로 S3에 직접 업로드
    const response = await fetch(preSignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`S3 업로드 실패: ${response.status} ${response.statusText}`);
    }

    console.log('S3 업로드 성공:', imgName);
    return true;
  } catch (error) {
    console.error('S3 업로드 에러:', error);
    return false;
  }
};

/**
 * 여러 파일을 S3에 업로드
 * @param files - 업로드할 파일 배열
 * @param uploadInfoList - 각 파일에 대한 업로드 정보 배열
 * @returns 성공한 업로드 수
 */
export const uploadMultipleToS3 = async (
  files: File[], 
  uploadInfoList: ImageUploadInfo[]
): Promise<number> => {
  const uploadPromises = files.map((file, index) => 
    uploadToS3(file, uploadInfoList[index])
  );

  const results = await Promise.all(uploadPromises);
  const successCount = results.filter(result => result).length;

  return successCount;
}; 