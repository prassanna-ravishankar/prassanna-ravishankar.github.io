<template>
  <div class="mt-8">
    <div class="mt-2">
      <h2 class="mb-2 text-xl text-gray-700 font-bold dark:text-blue-200 capitalize">
        Machine Learning
      </h2>

      <ul class="flex flex-wrap gap-4 items-center text-gray-400 font-bold dark:text-blue-200 uppercase">
        <!-- <li class="flex items-center">
          <Html class="h-10 w-10 rounded-sm drop-shadow-sm"></Html>
        </li>

        <li class="flex items-center">
          <Css class="h-10 w-10 rounded-sm drop-shadow-sm"></Css>
        </li> -->
        <li class="flex items-center ">
          Pytorch
        </li>
        <li class="flex items-center">
          Numpy
        </li>
        <li class="flex items-center">
          Huggingface
        </li>
        <li class="flex items-center">
          Scikit-learn
        </li>
        <li class="flex items-center">
          OpenCV
        </li>
        <li class="flex items-center">
          DeepSpeed
        </li>
        <li class="flex items-center">
          Onnx
        </li>
        <!-- <li class="flex items-center">
          <Opencv class="h-20 w-40"></Opencv>
        </li> 
        <li class="flex items-center">
          <Huggingface class="h-20 w-40"></Huggingface>
        </li>
        <li class="flex items-center">
          <Sklearn class="h-30 w-50"></Sklearn>
        </li> -->
      </ul>
    </div>

    <div class="mt-4">
      <h2 class="mb-2 text-xl text-gray-700 font-bold dark:text-blue-200 capitalize">
        Engineering
      </h2>
      <ul class="flex flex-wrap gap-4 items-center text-gray-400 font-bold dark:text-blue-200 uppercase">
        <li>
          FastAPI
        </li>
        <li>
          Streamlit
        </li>
        <li>
          NetworkX
        </li>
        <li>
          asyncio
        </li>
        <li>
          Dask
        </li>
        <li>
          Prefect
        </li>
      </ul>
    </div>

    <div class="mt-4">
      <h2 class="mb-2 text-xl text-gray-700 font-bold dark:text-blue-200 capitalize">
        Infrastructure
      </h2>
      <ul class="flex flex-wrap gap-4 items-center text-gray-400 font-bold dark:text-blue-200 uppercase">
        <li>
          Docker
        </li>
        <li>
          Terraform
        </li>
        <li>
          AWS 
        </li>
        <li>
          AWS Sagemaker 
        </li>
        <li>
           RESTful API
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Pytorch from "../assets/devicon/pytorch.svg?inline";
import Numpy from "../assets/devicon/numpy.svg?inline";
import Opencv from "../assets/devicon/opencv.svg?inline";
import Sklearn from "../assets/devicon/scikitlearn.svg?inline";
import Huggingface from "../assets/devicon/huggingface_raster.jpeg?inline";
export default {
  components: {
    Pytorch,
    Numpy,
    Opencv,
    Sklearn,
    Huggingface
  },
};
</script>
