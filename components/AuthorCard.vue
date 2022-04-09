<template>
  <div class="md:fixed">
    <div class="md:block flex justify-center items-center">
      <nuxt-img
        :src="siteMetadata.author_image"
        loading="lazy"
        alt="me"
        class="shadow-xl md:h-60 md:w-60 h-40 w-40 rounded-full"
      />
      <div class="mb-2 mx-7 mt-4 justify-center items-center">
        <h1
          class="md:text-3xl text-2xl text-gray-800 font-bold dark:text-blue-100"
        >
          {{ siteMetadata.author }}
        </h1>
        <h2
          class="md:text-lg text-lg text-gray-400 font-bold dark:text-blue-100"
        >
          {{ siteMetadata.slogan }}
        </h2>
        <div class="md:text-lg text-gray-600 dark:text-blue-100">
          {{ siteMetadata.position }}
        </div>
        <a
          :href="`mailto:${siteMetadata.email}`"
          class="text-gray-600 md:hidden mt-1 dark:text-blue-100"
        >
          {{ siteMetadata.email }}
        </a>
      </div>
    </div>

    <div class="mx-7 hidden md:block ">
      <div class="my-2 text-gray-600 flex dark:text-blue-100">
        <Mail />
        <a :href="`mailto:${siteMetadata.email}`">&nbsp;&nbsp; {{ siteMetadata.email }}</a>
      </div>
      <div class="my-2 text-gray-600 flex dark:text-blue-100">
        <Glob />
        <p>&nbsp;&nbsp; {{ siteMetadata.location }}</p>
      </div>
      <div class="my-2 text-gray-600 flex dark:text-blue-200">
        <Github />
        <a :href="siteMetadata.github">&nbsp;&nbsp; {{ siteMetadata.githubUser }}</a>
      </div>
      <div class="my-2 text-gray-600 flex dark:text-blue-200">
        <Linkedin />
        <a :href="siteMetadata.linkedin">&nbsp;&nbsp; {{ siteMetadata.linkedinUser }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import Mail from "../assets/icon/mail.svg?inline";
import Glob from "../assets/icon/glob.svg?inline";
import Github from "../assets/icon/github_new.svg?inline";
import Linkedin from "../assets/icon/linkeding.svg?inline";
import siteMetaInfo from "@/data/sitemetainfo";
export default {
  components: { Mail, Glob, Github, Linkedin },
  data: () => {
    return {
      siteMetadata: siteMetaInfo,
    };
  },
};
</script>
