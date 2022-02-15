import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Flex, Text, Image } from '@chakra-ui/react';
import { useState } from 'react';

const Example = dynamic(
  () => import('../components/Example'),
  { ssr: false }
)



export default function Home() {
  return (
    <Flex w='100vw' h='100vh' justify='space-between'>
      <Flex w='250px'>nav</Flex>
      <Flex justify='center' align='start' flex={1}>
        <Example />
      </Flex>
    </Flex>
  );
}
