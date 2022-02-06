import Head from 'next/head';
import { Flex, Text, Image } from '@chakra-ui/react';
import { useState } from 'react';
import Example from '../components/Example';

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
