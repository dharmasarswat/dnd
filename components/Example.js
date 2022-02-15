import {
  useState,
  useContext,
  useMemo,
  createRef,
  useRef,
  useEffect
} from "react";
import {
  Flex,
  Text,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  Container,
  Box,
  useColorMode,
  useColorModeValue,
  Button,
  RadioGroup,
  Radio,
  Center,
  Textarea
} from "@chakra-ui/react";
import {
  SearchIcon,
  SmallCloseIcon,
  DeleteIcon,
  EditIcon,
  MoonIcon,
  SettingsIcon,
  AddIcon,
  SunIcon
} from "@chakra-ui/icons";
import { BsThreeDotsVertical, BsArrowDownUp } from "react-icons/bs";
import { FiBookmark, FiRefreshCcw, FiCamera } from "react-icons/fi";
import { FaFileExport } from "react-icons/fa";
import { nanoid } from "nanoid";
import { GlobalContext } from "../context/GlobalStore";
import { useForm, useFieldArray } from "react-hook-form";
import Draggable from "react-draggable";
import {
  exportComponentAsPNG,
  exportComponentAsJPEG,
  exportComponentAsPDF
} from "react-component-export-image";

const exportImageAs = (imageType, ref) => {
  const fileName = `download.${imageType}`;
  if (imageType === "png") {
    exportComponentAsPNG(ref, { fileName });
  } else if (imageType === "jpeg") {
    exportComponentAsJPEG(ref, { fileName });
  } else if (imageType === "pdf") {
    exportComponentAsPDF(ref, {
      fileName,
      pdfOptions: { unit: "px", pdfFormat: "a4", quality: "1" }
    });
  }
};

// pce constructor start
export default function PceConstructor({ id, description, imageURL }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { defaultPceLibrary } = useContext(GlobalContext);
  const [search, setSearch] = useState("");
  const [showImage, setShowImage] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [dragURL, setDragURL] = useState("");
  const [Description, setDescription] = useState("");
  const [enableArrange, setEnableArrange] = useState(false);

  const filteredPceLibrary = defaultPceLibrary.filter((item) =>
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const {
    getValues,
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      projectName: "hhh",
      category: "pce",
      pceItems: [
        {
          imageURL: "",
          description: "",
          connection: "",
          pressureRating: "",
          minId: 1,
          length: 1
        },
        {
          imageURL: "",
          description: "",
          connection: "",
          pressureRating: "",
          minId: 1,
          length: 1
        },
        {
          imageURL: "",
          description: "",
          connection: "",
          pressureRating: "",
          minId: 1,
          length: 1
        }
      ]
    }
  });

  const { append, move, remove } = useFieldArray({
    control,
    name: "pceItems"
  });

  // pce item start
  const PceItem = ({ id, description, imageURL }) => {
    const handleDragStartImage = (e) => {
      setIsDragging(true);
      setDragURL(imageURL);
    };

    const handleDragStartDescription = (e) => {
      setIsDragging(true);
      e.dataTransfer.setData("text/plain", description);
      setDescription(description);
      console.log(description);
    };

    return (
      <Flex
        my={2}
        borderWidth="1px"
        borderRadius="5px"
        borderTopColor="blue.500"
        borderTopWidth="2px"
        justify="space-between"
        key={id}
      >
        {showImage ? (
          <Flex
            mt={1}
            w="40%"
            onDragStart={handleDragStartImage}
            cursor="pointer"
          >
            <Image boxSize="90px" objectFit="contain" src={imageURL} />
          </Flex>
        ) : (
          <Flex
            mt={1}
            w="40%"
            onDragStart={handleDragStartImage}
            cursor="pointer"
          >
            <Image boxSize="90px" objectFit="contain" src="/no-image.svg" />
          </Flex>
        )}
        <Flex flexDirection="column" w="60%">
          <Flex justify="end">
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                variant="ghost"
                icon={<BsThreeDotsVertical />}
              />
              <MenuList w="50%">
                <MenuItem icon={<EditIcon />} onClick={() => setShowForm(true)}>
                  Update
                </MenuItem>
                <MenuItem
                  icon={<FiBookmark />}
                  onClick={() => alert("set isPriority=true")}
                >
                  Set as Priority
                </MenuItem>
                <MenuItem
                  icon={<DeleteIcon />}
                  onClick={() => handleDeletePceItem(pceItemId, filename)}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <Flex
            justify="center"
            draggable
            onDragStart={handleDragStartDescription}
            cursor="pointer"
          >
            <Text fontSize="xs" variant="unstyled" resize="none">
              {description}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    );
  };
  // pce item end

  // pce list start
  const PceList = () => {
    return (
      <div className="overflow-y-auto scrollbar-hide w-full">
        {filteredPceLibrary.map(({ id, description, imageURL }) => (
          <PceItem
            key={id}
            id={id}
            description={description}
            imageURL={imageURL}
          />
        ))}
      </div>
    );
  };
  // pce list end

  const DndForm = () => {
    const [activeItem, setActiveItem] = useState(null);
    const [itemHovering, setItemHovering] = useState(null);

    const onSubmit = (data) => {
      console.log("data: ", data);
      // alert(JSON.stringify(data, null, 2));
    };

    const handleDragOverImage = (e, index) => {
      e.preventDefault();
      if (dragURL) {
        setValue(`pceItems.${index}.imageURL`, dragURL);
        setIsDragging(false);
        setDragURL(null);
      }
    };

    const handleDragOverDescription = (e, index) => {
      e.preventDefault();
      if (Description) {
        setValue(`pceItems.${index}.description`, Description);
        setIsDragging(false);
        setDescription(null);
      }
    };

    const [statics, setStatics] = useState({
      minID: "",
      totalLength: "",
      count: ""
    });

    const formRef = useRef();

    const fields = getValues("pceItems");

    useEffect(() => {
      setStatics({
        count: fields.length,
        minID: Math.min(
          ...fields
            .filter((field) => !isNaN(parseFloat(field.minId)))
            .map((field) => parseFloat(field.minId))
        ),
        totalLength: fields
          .filter((field) => !isNaN(parseFloat(field.length)))
          .map((field) => parseFloat(field.length))
          .reduce((a, b) => a + b, 0)
      });
    }, [JSON.stringify(fields)]);

    const handleRowDrop = (e, index) => {
      if (!isDragging) {
        e.dataTransfer.dropEffect = "linkMove";
        move(activeItem, index);
        setActiveItem(null);
        e.currentTarget.style.border = "none";
      }
    };

    const handleRowDrag = (e, index) => {
      e.preventDefault();
      e.currentTarget.style.border = "none";
      if (!isDragging) {
        e.target.style.color = "blue";
        // checking NaN because 0 is false and index can be false
        if (isNaN(parseInt(activeItem))) setActiveItem(index);
      }
    };

    const nodeRef = useRef();

    return (
      <>
        {/* header start */}
        <Flex w="full" flexDirection="column">
          <Container maxW="2xl">
            <Flex justify="center" alignItems="center" flexDir="column">
              <Flex py={6} w="full" justify="space-between">
                <InputGroup maxW="468px">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input type="text" placeholder="Search Items" />
                  <InputRightElement>
                    <IconButton
                      aria-label="Reset search"
                      icon={<SmallCloseIcon />}
                      variant="ghost"
                      onClick={(e) => setSearch("")}
                    />
                  </InputRightElement>
                </InputGroup>
                <Flex>
                  <Box>
                    {colorMode === "light" ? (
                      <IconButton
                        variant="outline"
                        aria-label="Toggle Dark"
                        icon={<MoonIcon />}
                        onClick={toggleColorMode}
                      />
                    ) : (
                      <IconButton
                        variant="outline"
                        aria-label="Toggle Light"
                        icon={<SunIcon />}
                        onClick={toggleColorMode}
                      />
                    )}
                  </Box>
                  <Button ml={3} variant="outline" colorScheme="blue" w="108px">
                    Logout
                  </Button>
                </Flex>
              </Flex>

              <Flex
                flexDirection="row"
                flex={1}
                w="full"
                justify="space-between"
              >
                <Button
                  w="108px"
                  colorScheme="blue"
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
                <Flex align="center">
                  <Menu closeOnSelect={false}>
                    <MenuButton
                      as={IconButton}
                      icon={<SettingsIcon />}
                      variant="outline"
                    />
                    <MenuList>
                      <RadioGroup defaultValue="imperial">
                        <MenuItem>
                          <Radio size="md" value="imperial" colorScheme="blue">
                            Imperial
                          </Radio>
                        </MenuItem>
                        <MenuItem>
                          <Radio size="md" value="metric" colorScheme="blue">
                            Metric
                          </Radio>
                        </MenuItem>
                      </RadioGroup>
                    </MenuList>
                  </Menu>
                  <IconButton
                    variant="outline"
                    aria-label="Toggle Light"
                    icon={<FiRefreshCcw />}
                    ml={3}
                    onClick={() => reset()}
                  />
                  <IconButton
                    variant={enableArrange ? "solid" : "outline"}
                    aria-label="Toggle Light"
                    icon={<BsArrowDownUp />}
                    ml={3}
                    onClick={() => setEnableArrange((arrange) => !arrange)}
                  />

                  <IconButton
                    ml={3}
                    variant="outline"
                    aria-label="Add Item"
                    icon={<AddIcon />}
                    onClick={() => {
                      append({
                        imageURL: "",
                        description: "",
                        connection: "",
                        pressureRating: "",
                        minId: 0,
                        length: 0
                      });
                    }}
                  />
                  <Menu closeOnSelect={false}>
                    <MenuButton
                      as={Button}
                      variant="outline"
                      leftIcon={<FaFileExport />}
                      ml={3}
                    >
                      Export
                    </MenuButton>
                    <MenuList maxWidth="100px">
                      <MenuOptionGroup defaultValue="pdf" type="radio">
                        <MenuItemOption
                          value="pdf"
                          onClick={() => exportImageAs("pdf", formRef)}
                        >
                          PDF
                        </MenuItemOption>
                        <MenuItemOption
                          value="jpeg"
                          onClick={() => exportImageAs("jpeg", formRef)}
                        >
                          JPEG
                        </MenuItemOption>
                        <MenuItemOption
                          value="png"
                          onClick={() => exportImageAs("png", formRef)}
                        >
                          PNG
                        </MenuItemOption>
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                </Flex>
              </Flex>
            </Flex>
          </Container>
        </Flex>

        {/* header end */}

        <div
          // overflow-y-auto - removed this
          className=" scrollbar-hide"
        >
          <Container
            maxW="2xl"
            mt={6}
            minH="600px"
            px={4}
            id="form_to_export"
            ref={formRef}
          >
            {/* constructor form start */}

            <form>
              <Flex w="full" flexDir="column" borderWidth="1px">
                {/* project name start */}
                <Flex justify="center" alignItems="center" my={3}>
                  <Input
                    placeholder="Project Name"
                    variant="unstyled"
                    textAlign="center"
                    maxW="300px"
                    fontSize="lg"
                    type="text"
                    {...register("projectName", { required: true })}
                  />
                </Flex>
                {/* project name end */}

                {/* header start */}
                <Flex
                  w="full"
                  h="30px"
                  borderTopWidth="1px"
                  borderBottomWidth="1px"
                >
                  <Center w="40px" borderRightWidth="1px">
                    <Text fontSize="xs">Item</Text>
                  </Center>
                  <Center w="100px" borderRightWidth="1px">
                    <Text fontSize="xs">Image</Text>
                  </Center>
                  <Center w="100px" borderRightWidth="1px">
                    <Text fontSize="xs">Description</Text>
                  </Center>
                  <Center w="100px" borderRightWidth="1px">
                    <Text fontSize="xs">Connection</Text>
                  </Center>
                  <Center w="100px" borderRightWidth="1px">
                    <Text fontSize="xs">Rating, psi</Text>
                  </Center>
                  <Center w="100px" borderRightWidth="1px">
                    <Text fontSize="xs">Min.ID, in</Text>
                  </Center>
                  <Center w="100px">
                    <Text fontSize="xs">Length, ft</Text>
                  </Center>
                </Flex>
                {/* header end */}

                {/* dnd row start */}
                {fields?.map((field, index) => {
                  return (
                    <Flex
                      key={index}
                      onMouseEnter={
                        enableArrange ? () => {} : () => setItemHovering(index)
                      }
                      onMouseLeave={
                        enableArrange ? () => {} : () => setItemHovering(null)
                      }
                      cursor={enableArrange ? "grabbing" : "default"}
                      draggable={!enableArrange}
                      onDragOver={
                        enableArrange
                          ? () => {}
                          : (e) => handleRowDrag(e, index)
                      }
                      onDrop={
                        enableArrange
                          ? () => {}
                          : (e) => handleRowDrop(e, index)
                      }
                      onDragStart={
                        enableArrange
                          ? () => {}
                          : (event) =>
                              (event.currentTarget.style.border =
                                "1px dashed black")
                      }
                    >
                      <Flex
                        w="full"
                        h="100px"
                        key={index}
                        style={{ position: "relative" }}
                      >
                        {itemHovering === index && (
                          <Center
                            style={{
                              position: "absolute",
                              top: "0",
                              bottom: "0",
                              left: "-40px"
                            }}
                          >
                            <IconButton
                              variant={enableArrange ? "solid" : "outline"}
                              aria-label="Delete row"
                              icon={<DeleteIcon />}
                              onClick={() => remove(index)}
                            />
                          </Center>
                        )}
                        <Center w="42px" borderRightWidth="1px">
                          <Text fontSize="xs">{index + 1}</Text>
                        </Center>
                        <Center minW="100px" borderRightWidth="1px">
                          {!!field.imageURL ? (
                            <div style={{ zIndex: fields.length - index }}>
                              <Draggable
                                bounds={{
                                  left: 0,
                                  right: 0,
                                  top: index === 0 ? 0 : -100,
                                  bottom: index === fields.length - 1 ? 0 : 100
                                }}
                                disabled={!enableArrange}
                                nodeRef={nodeRef}
                                axis="y"
                                scale={1}
                              >
                                <div ref={nodeRef}>
                                  <Image
                                    alt="Image"
                                    boxSize="98px"
                                    src={field.imageURL}
                                    className="formImage"
                                  />
                                </div>
                              </Draggable>
                            </div>
                          ) : (
                            <Center
                              onDrop={
                                enableArrange
                                  ? () => {}
                                  : (e) => handleDragOverImage(e, index)
                              }
                            >
                              <Text
                                fontSize="xs"
                                color="gray.500"
                                align="center"
                                width="100%"
                                height="100%"
                                verticalAlign="center"
                                {...register(`pceItems.${index}.imageURL`)}
                              >
                                Drop here
                              </Text>
                            </Center>
                          )}
                        </Center>

                        <Center w="100px" borderRightWidth="1px">
                          <textarea
                            className="resize-none bg-transparent p-1 text-xs min-h-full overflow-y-auto scrollbar-hide focus:outline-none text-center"
                            onDrop={
                              enableArrange
                                ? () => {}
                                : (e) => handleDragOverDescription(e, index)
                            }
                            {...register(`pceItems.${index}.description`)}
                          />
                        </Center>
                        <Center w="100px" borderRightWidth="1px">
                          <textarea
                            className="resize-none bg-transparent p-1 text-xs min-h-full overflow-y-auto scrollbar-hide focus:outline-none text-center"
                            {...register(`pceItems.${index}.connection`)}
                          />
                        </Center>
                        <Center w="100px" borderRightWidth="1px">
                          <textarea
                            className="resize-none bg-transparent p-1 text-xs min-h-full overflow-y-auto scrollbar-hide focus:outline-none text-center"
                            {...register(`pceItems.${index}.pressureRating`)}
                          />
                        </Center>
                        <Center w="100px" borderRightWidth="1px">
                          <textarea
                            className="resize-none bg-transparent p-1 text-xs min-h-full overflow-y-auto scrollbar-hide focus:outline-none text-center"
                            {...register(`pceItems.${index}.minId`, {
                              validate: {
                                positive: (v) => parseFloat(v) > 0
                              },
                              required: true,
                              setValueAs: (v) => parseFloat(v)
                            })}
                          />
                        </Center>
                        <Center w="100px">
                          <textarea
                            className="resize-none bg-transparent p-1 text-xs min-h-full overflow-y-auto scrollbar-hide focus:outline-none text-center"
                            {...register(`pceItems.${index}.length`, {
                              validate: {
                                positive: (v) => parseFloat(v) > 0
                              },
                              required: true,
                              setValueAs: (v) => parseFloat(v)
                            })}
                          />
                        </Center>
                      </Flex>
                    </Flex>
                  );
                })}
                {/* dnd row end */}
                <Flex
                  w="full"
                  h="30px"
                  borderTopWidth="1px"
                  justify="space-between"
                  px={1}
                >
                  <Flex justify="center" alignItems="center">
                    <Text fontSize="xs" mr={2}>
                      Total:
                    </Text>
                    <Text fontSize="xs"> Items: {statics.count}</Text>
                  </Flex>
                  <Flex justify="center" alignItems="center">
                    <Text fontSize="xs" mr={3}>
                      Min. ID, {statics.minID}
                    </Text>
                    <Text fontSize="xs">Length: {statics.totalLength}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </form>

            {/* constructor form end */}
          </Container>
        </div>
      </>
    );
  };
  return (
    <Flex w="full" h="100vh" justify="space-between">
      <Flex flex={1} flexDirection="column">
        <DndForm />
      </Flex>
      <Flex
        maxW="250px"
        w="full"
        align="start"
        justify="start"
        flexDir="column"
        p={3}
      >
        <Flex>
          <Text mt={5} fontWeight="bold" fontSize="sm" textAlign="center">
            Pressure Control Equipment
          </Text>
        </Flex>
        <Flex>
          <InputGroup maxW="468px" mt={8}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search Items"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label="Reset search"
                icon={<SmallCloseIcon />}
                variant="ghost"
                onClick={(e) => setSearch("")}
              />
            </InputRightElement>
          </InputGroup>
        </Flex>
        <Flex>
          <Text fontSize="xs" mt={1}>
            Items: {filteredPceLibrary.length}
          </Text>
        </Flex>
        <PceList />
      </Flex>
    </Flex>
  );
}
// pce constructor end
