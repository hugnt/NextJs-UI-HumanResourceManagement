"use client"
import { Card } from '@/components/ui/card'
import React, { useEffect, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import * as faceapi from 'face-api.js';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusHistory } from '@/data/schema/history.schema'
import { FaCamera } from 'react-icons/fa';
import { ApiResponse } from '@/data/type/response.type';
import { toaster } from '@/components/custom/_toast';
import { useMutation } from '@tanstack/react-query';
import workShiftApiRequest from '@/apis/work-shift.api';
type LabelDescriptions = {
  name: string,
  id: number,
  descriptions: string[]
}
const QUERY_KEY = {
  MUTATION_KEY: "check-in-out"
}
export default function page() {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [history, setHistory] = useState<string | undefined>(undefined);
  const handleCameraClick = () => {
    if (!isCameraOpen && history == undefined) {
      toaster.error({
        title: 'Chưa chọn kiểu chấm công',
        message: "Chưa chọn kiểu chấm công",
      }, {
        position: "bottom-right",
        autoClose: 2000
      })
      return;
    } else {
      setIsCameraOpen((prev) => !prev);
      if (!isCameraOpen) {
        startVideo();
      } else {
        stopVideo();
      }
    }
  };
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
      const startRecognition = async () => {
        const labeledFaceDescriptors = await loadLabeledImages();
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

        const intervalId = setInterval(async () => {
          if (videoRef.current) {
            const detections = await faceapi
              .detectSingleFace(videoRef.current)
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (detections) {
              const match = faceMatcher.findBestMatch(detections.descriptor);
              console.log('Match:', match.toString());
              if (!match.toString().includes("unknown")) {
                handleCameraClick()
                setHistory(undefined)
                let id = Number(match.toString().split('_')[0])
                mutate(id); 
              }
            }
          }
        }, 200);

        return () => clearInterval(intervalId);
      };

      startRecognition();
    }
  }, [isCameraOpen, modelsLoaded]);

  const toVietnamTimeISOString = (date: Date): string => {
    const vietnamTimeOffset = 7 * 60; // UTC+7 in minutes
    const localDate = new Date(date.getTime() + vietnamTimeOffset * 60 * 1000);
    return localDate.toISOString().replace("Z", "+07:00");
  }
  async function loadLabeledImages() {
    const labeledItems = await fetchAllLabeledItems();
    if (!labeledItems || !labeledItems.metadata) {
      console.error("No labeled items found.");
      return [];
    }
    // Lặp qua từng item trong metadata của dữ liệu trả về
    const labels = labeledItems.metadata.map(item => item.id + "_" + item.name);
    const descriptions: Float32Array[][] = labeledItems.metadata.map(item => {
      return item.descriptions.map(description => {
        const parsedData = JSON.parse(description);
        const valuesArray = Object.values(parsedData) as number[]; // Explicitly cast to number[]
        return new Float32Array(valuesArray);
      });
    });
    // Tạo các LabeledFaceDescriptors cho mỗi label và descriptions tương ứng
    return Promise.all(
      labels.map((label, index) => {
        console.log(label, descriptions[index])
        return new faceapi.LabeledFaceDescriptors(label, descriptions[index]);
      })
    );
  }
  async function fetchAllLabeledItems(): Promise<ApiResponse<LabelDescriptions[]> | undefined> {
    try {
      const response = await fetch("https://localhost:7025/api/v1/employees/get-all-labeled", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Error! Status: ${response.status}`);
      }

      const labeledItems = await response.json();
      console.log("Labeled items:", labeledItems);
      return labeledItems;
    } catch (error) {
      console.error("Failed to fetch labeled items:", error);
    }
  }

  const getStatusHistory = () => {
    if (history == "1") return StatusHistory.In;
    else return StatusHistory.Out
  }

  const { mutate } = useMutation({
    mutationKey: [QUERY_KEY.MUTATION_KEY],
    mutationFn: (id: number) => {
      return workShiftApiRequest.checkInOutEmployee(id, {
        timeSweep: toVietnamTimeISOString(new Date()),
        statusHistory: getStatusHistory()
      })
    },
    onSuccess(data) {
      if (data.isSuccess) {
        toaster.success({
          title: "Chấm công thành công",
          message: data.metadata?.employeeName + "  " + data.metadata?.timeSweep,
        }, {
          position: "bottom-right",
          autoClose: 10000
        })
      }
    }
  })
  return (
    <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>

        <Card className='p-6'>
          <div className='flex flex-col space-y-2 text-left mb-5'>
            <h1 className='text-2xl font-semibold tracking-tight'>Chấm công</h1>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 flex items-center justify-center">
            <div>
              <AlertDialog open={isCameraOpen} onOpenChange={handleCameraClick}>
                <AlertDialogTrigger asChild>
                  <FaCamera
                    className='text-center text-[60px] cursor-pointer transition-transform duration-200 hover:text-gray-400'
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>Chụp ảnh</AlertDialogHeader>
                  {isCameraOpen && (
                    <video
                      className="border rounded-lg transform scale-x-[-1]"
                      ref={videoRef}
                      autoPlay
                      muted
                      width="720"
                      height="560"
                    />
                  )}
                  <AlertDialogFooter>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <Select value={history} onValueChange={(e) => setHistory(e)}>
            <SelectTrigger className="w-full mt-4">
              <SelectValue placeholder="Chọn trạng thái chấm công" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Trạng thái chấm công</SelectLabel>
                <SelectItem value={StatusHistory.In.toString()}>Vào</SelectItem>
                <SelectItem value={StatusHistory.Out.toString()}>Ra</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
            Bằng cách click vào camera nó sẽ giúp bạn chụp ảnh và chấm công{' '}
          </p>
        </Card>
      </div>
    </div>
  )
}
