import React from 'react';
import { Flex, Button, Heading, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function index() {
  const router = useRouter();
  return (
    <Box>
      <Heading>Home Page</Heading>
      <Button onClick={() => router.push('/example')}>
        Go to PCE Constructor
      </Button>
    </Box>
  );
}
