"use client"
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';
import React, { useEffect, useRef, useState } from 'react'
import { FaCamera } from 'react-icons/fa';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/custom/button';
import { toaster } from '@/components/custom/_toast';
import { useCurrentUser } from '@/app/system/ui/auth-context';
const pathList: Array<PathItem> = [
  {
    name: "History",
    url: "/time-keeping"
  },
  {
    name: "Face Registration",
    url: "/history/face-regconition"
  },
];
const statusFaceTurn: string[] = ["Ảnh 1", "Ảnh 2"]
export default function page() {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null); // Chỉ định kiểu cho ref
  const [capturedImage, setCapturedImage] = useState<(string | null)[]>([]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updateCapturedImageAtIndex = (index: number, newImage: string) => {
    setCapturedImage(prevImages => {
      const updatedImages = [...prevImages]; // Tạo bản sao của mảng hiện tại
      updatedImages[index] = newImage; // Cập nhật ảnh tại chỉ số tương ứng
      return updatedImages; // Trả về mảng mới
    });
  };
  const updateImageFilesAtIndex = (index: number, newImage: File) => {
    setImageFiles(prevImages => {
      const updatedImages = [...prevImages]; // Tạo bản sao của mảng hiện tại
      updatedImages[index] = newImage; // Cập nhật ảnh tại chỉ số tương ứng
      return updatedImages; // Trả về mảng mới
    });
  };
  const updateImageFilesAtIndexesToNull = (indexes: number[]) => {
    setImageFiles(prevImages => {
      const updatedImages = [...prevImages]; // Tạo bản sao của mảng hiện tại
      indexes.forEach(index => {
        updatedImages[index] = null; // Cập nhật ảnh tại các chỉ số tương ứng về null
      });
      return updatedImages; // Trả về mảng mới
    });
  };

  const handleCameraClick = () => {
    setIsCameraOpen(!isCameraOpen);
  };

  const capture = (index: number) => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        updateCapturedImageAtIndex(index, imageSrc); // Lưu ảnh vào state

        // Chuyển đổi URL base64 sang File
        const blobData = dataURItoBlob(imageSrc);
        const imageFile = new File([blobData], `image_${index}.png`, { type: 'image/png' });
        updateImageFilesAtIndex(index, imageFile); // Lưu file ảnh vào state

        setIsCameraOpen(false); // Đóng camera
      }
    }
  };
  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      ]);
      console.log('Models Loaded');
    };
    loadModels();
  }, []);
  const loadLabeledImages = async () => {
    const labels = ["HongPhuc"];
    const descriptors = await Promise.all(
      labels.map(async (label) => {
        setIsLoading(true)
        const descriptions: Float32Array[] = [];
        const detectNulls: number[] = [];
        for (let i = 0; i < 2; i++) {
          const img = await faceapi.fetchImage(capturedImage[i]!);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          console.log(detections)
          if (detections) {
            descriptions.push(detections.descriptor);
          } else {
            detectNulls.push(i);
          }
        }
        console.log(descriptions)
        console.log(detectNulls)
        if (detectNulls.length > 0) {
          toaster.error({
            title: 'Error',
            message: 'Lỗi ảnh' + JSON.stringify(detectNulls),
          }, {
            position: "bottom-right",
            autoClose: 2000
          })
        }
        setIsLoading(false)
        updateImageFilesAtIndexesToNull(detectNulls)
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
    //console.log(descriptors)
    return descriptors;
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: 'image/png' });
  }
  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>History TimeKeeping</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>
      <div className='mt-4 mb-4'>
        <p className='text-sm text-gray-600'>Chụp ảnh để làm dữ liệu cho việc chấm công khuôn mặt</p>
        <p className='text-sm text-gray-600'>Lưu ý : Bạn phải tìm nơi có đủ ánh sáng, và chụp đủ 2 ảnh với 2 trạng thái khác nhau.</p>
        <p className='text-sm text-gray-600'>Nhớ vén tóc, cởi bỏ kính để quá trình có thể diễn ra tốt nhất</p>
      </div>
      <div className="container mx-auto mt-4 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {
            statusFaceTurn.map((item, index) => {
              return <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {capturedImage[index] != null ? ( // Nếu đã chụp ảnh, hiển thị ảnh
                        <img src={capturedImage[index]} alt="Captured" className="w-full h-auto rounded-lg transform scale-x-[-1]" />
                      ) : (
                        <FaCamera
                          onClick={handleCameraClick}
                          className='text-center text-[60px] cursor-pointer transition-transform duration-200 hover:text-gray-400'
                        />
                      )}

                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        {item}
                      </AlertDialogHeader>
                      {isCameraOpen && (
                        <div className="mt-4">
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="border rounded-lg transform scale-x-[-1]" // Lật ngược video
                          />
                        </div>
                      )}
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => capture(index)}>Take a photo</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <p className='text-center text-[12px] text-gray-600'>{item}</p>
                </div>

              </div>
            })
          }
        </div>
        <div className='flex items-center justify-end'>
          <Button>Delete All</Button>
          <Button loading={isLoading} onClick={() => loadLabeledImages()}>Save</Button>
        </div>
      </div>
    </>

  )
}
