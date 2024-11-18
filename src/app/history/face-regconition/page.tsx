"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import * as faceapi from 'face-api.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';
import Webcam from 'react-webcam';
import { toaster } from '@/components/custom/_toast';
import { Button } from '@/components/custom/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { handleSuccessApi } from '@/lib/utils';
import faceRegisApiRequest from '@/apis/faceRecognition';
import { useCurrentUser } from '@/app/system/ui/auth-context';
const pathList: Array<PathItem> = [
  { name: "History", url: "/time-keeping" },
  { name: "Face Registration", url: "/history/face-recognition" },
];

const infors = ["Phát hiện khuôn mặt", "Không phát hiện khuôn mặt"]
const statusFaceTurn: string[] = ["Nhìn lên", "Nhìn xuống", "Nhìn trái", "Nhìn phải", "Nhìn thẳng"];
const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: 'image/png' });
}
const QUERY_KEY = {
  MUTATION_ADD_KEY: "face-regis",
  MUTATION_UDPTE_KEY: "update-face-regis",
  KEY_LIST: "get-by-employee-id"
}
export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  //const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<Webcam>(null); // Chỉ định kiểu cho ref
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [infor, setInfor] = useState<string>("")
  const [capturedImage, setCapturedImage] = useState<(string | null)[]>([]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);
  const [descriptor, setDescriptor] = useState<Float32Array>();
  const [descriptions, setDescriptions] = useState<(Float32Array | null)[]>([])
  const [ids, setIds] = useState<number[]>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const user = useCurrentUser().currentUser;


  const handleCameraClick = () => {
    setIsCameraOpen((prev) => !prev);
    if (!isCameraOpen) {
      startVideo();
    } else {
      stopVideo();
    }
    setInfor("")
    setDescriptor(undefined)
  };
  const updateDescriptionAtIndex = (index: number, newDescription: Float32Array | null) => {
    setDescriptions((prevDescriptions) => {
      const updatedDescriptions = [...prevDescriptions];
      updatedDescriptions[index] = newDescription;
      return updatedDescriptions;
    });
  };
  const updateImageFilesAtIndex = (index: number, newImage: File | null) => {
    setImageFiles(prevImages => {
      const updatedImages = [...prevImages]; // Tạo bản sao của mảng hiện tại
      updatedImages[index] = newImage; // Cập nhật ảnh tại chỉ số tương ứng
      return updatedImages; // Trả về mảng mới
    });
  };
  const updateCapturedImageAtIndex = (index: number, newImage: string | null) => {
    setCapturedImage(prevImages => {
      const updatedImages = [...prevImages]; // Tạo bản sao của mảng hiện tại
      updatedImages[index] = newImage; // Cập nhật ảnh tại chỉ số tương ứng
      return updatedImages; // Trả về mảng mới
    });
  };

  const capture = (index: number) => {
    if (descriptor == undefined) {
      toaster.error({
        title: 'Vấn đề phát hiện khuôn mặt',
        message: "Không thể phát hiện khuôn mặt",
      }, {
        position: "bottom-right",
        autoClose: 2000
      })
      return;
    }
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        updateCapturedImageAtIndex(index, imageSrc)
        // Chuyển đổi URL base64 sang File
        const blobData = dataURItoBlob(imageSrc);
        const imageFile = new File([blobData], `image_${index}.png`, { type: 'image/png' });
        updateImageFilesAtIndex(index, imageFile); // Lưu file ảnh vào state
        updateDescriptionAtIndex(index, descriptor)
        setDescriptor(undefined)
        setInfor("")
      }
      console.log(imageSrc)
    }
  };

  const regisFace = () => {
    console.log(capturedImage.length)
    if (capturedImage.length < 5) {
      toaster.error({
        title: 'Trạng thái khuôn mặt',
        message: "Không đủ trạng thái khuôn mặt",
      }, {
        position: "bottom-right",
        autoClose: 2000
      })
      return;
    }
    const formData = new FormData();
    // Add (Post)
    if (!isUpdate) {
      for (let i = 0; i < 5; i++) {
        formData.append("faceRegises[" + i + "].faceFile", imageFiles[i]!)
        formData.append("faceRegises[" + i + "].statusFaceTurn", (i + 1).toString())
        formData.append("faceRegises[" + i + "].descriptor", JSON.stringify(descriptions[i]))
        //console.log(imageFiles[0]!, (i + 1).toString(), JSON.stringify(descriptions[0]))
      }
      mutate(formData)
    } else {
      let index = 0;
      for (let i = 0; i < 5; i++) {
        if (imageFiles[i] != null) {
          formData.append("faceRegisUpdates[" + index + "].faceFile", imageFiles[i]!)
          formData.append("faceRegisUpdates[" + index + "].statusFaceTurn", (i + 1).toString())
          formData.append("faceRegisUpdates[" + index + "].descriptor", JSON.stringify(descriptions[i]))
          formData.append("faceRegisUpdates[" + index + "].id", ids[i].toString()!)
          console.log(imageFiles[i]!, (i + 1).toString(), JSON.stringify(descriptions[i]), ids[index].toString()!)
          index++
        }
      }
      mutateUpdate(formData)
    }
    console.log(isUpdate)
  }

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.KEY_LIST],
    queryFn: () => faceRegisApiRequest.getAllFaceRegisByEmployeeId(1)
  })

  const { mutate, isPending } = useMutation({
    mutationKey: [QUERY_KEY.MUTATION_ADD_KEY],
    mutationFn: (data: FormData) => faceRegisApiRequest.registrationFace(user!.id, data),
    onSuccess(data) {
      if (data.isSuccess) {
        handleSuccessApi({ message: "Face registration successfully" })
      }
    },
  })

  const { mutate: mutateUpdate, isPending: _ } = useMutation({
    mutationKey: [QUERY_KEY.MUTATION_UDPTE_KEY],
    mutationFn: (data: FormData) => faceRegisApiRequest.updateRegisFace(user!.id, data),
    onSuccess(data) {
      if (data.isSuccess) {
        handleSuccessApi({ message: "Face update registration successfully" })
      }
    },
  })

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      setModelsLoaded(true);
      console.log('Models Loaded');
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (isCameraOpen && modelsLoaded) {
      const intervalId = setInterval(async () => {
        if (videoRef.current
          //&& canvasRef.current
        ) {
          const detections = await faceapi
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor();

          // const canvas = canvasRef.current;
          // const displaySize = {
          //   width: videoRef.current.videoWidth,
          //   height: videoRef.current.videoHeight,
          // };

          // faceapi.matchDimensions(canvas, displaySize);

          if (detections) {
            // const resizedDetections = faceapi.resizeResults(detections, displaySize);
            // const context = canvas.getContext('2d');
            // if (context) {
            //   context.clearRect(0, 0, canvas.width, canvas.height);
            //   faceapi.draw.drawDetections(canvas, resizedDetections);
            //   faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            // }
            setInfor(infors[0])
            setDescriptor(detections.descriptor)
          } else {
            setInfor(infors[1])
            setDescriptor(undefined)
          }
          console.log('Detections:', detections);
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [isCameraOpen, modelsLoaded]);

  useEffect(() => {
    if (data && data.metadata && data.metadata.length > 0) {
      const urls = data.metadata.map(item => item.url);
      const idArray = data.metadata.map(item => item.id);
      setCapturedImage(urls)
      setIds(idArray)
      setIsUpdate(true);
    }
  }, [data, isLoading])
  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>History TimeKeeping</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>
      <div className='mt-4 mb-4'>
        <p className='text-sm text-gray-600'>Capture images for face recognition-based attendance</p>
        <p className='text-sm text-gray-600'>Note: Capture two images with different facial expressions.</p>
        <p className='text-sm text-gray-600'>Make sure to remove glasses and clear any obstructions.</p>
      </div>
      <div className="container mx-auto mt-4 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {statusFaceTurn.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
              <div>
                <AlertDialog onOpenChange={handleCameraClick}>
                  <AlertDialogTrigger asChild>
                    {capturedImage[index] != null ? ( // Nếu đã chụp ảnh, hiển thị ảnh
                      <img src={capturedImage[index]} alt="Captured" className="w-full h-auto rounded-lg transform scale-x-[-1]" />
                    ) : (
                      <FaCamera
                        className='text-center text-[60px] cursor-pointer transition-transform duration-200 hover:text-gray-400'
                      />
                    )}

                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>{item}</AlertDialogHeader>
                    {isCameraOpen && (
                      <div className="mt-4 ">
                        <video
                          className="border rounded-lg transform scale-x-[-1]"
                          ref={videoRef}
                          autoPlay
                          muted
                          width="720"
                          height="560"
                        />
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          width="465"
                          screenshotFormat="image/jpeg"
                          className="border rounded-lg transform scale-x-[-1] absolute top-20" // Lật ngược video
                        />
                        {/* <canvas
                          ref={canvasRef}
                          width="720"
                          height="560"
                          className="absolute bottom-0 left-0 transform scale-x-[-1] translate-x-[-2rem] translate-y-[-1rem]"
                        /> */}
                        <p className={`text-[14px] mt-4 text-center ${infor == infors[0] ? 'text-green-300' : 'text-red-300'}`}>{infor}</p>
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
          ))}
        </div>
        <div className='flex items-center justify-end'>
          {capturedImage.length == 5 && imageFiles.length > 0 ? <Button loading={isPending} onClick={() => regisFace()}>Save</Button> : <></>}
        </div>

      </div>
    </>
  );
}
