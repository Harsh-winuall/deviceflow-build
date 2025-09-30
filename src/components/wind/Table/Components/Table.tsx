"use client";
import { useEffect, useState } from "react";
// import { Icon } from '@/components/wind/Icons/index';
import DeviceFlowLoader from "@/components/deviceFlowLoader";
import { Checkbox } from "@/components/wind/Checkbox/index";
import { Skeleton } from "../../Skeleton";
import { SortArrow } from "../Icons/SortArrow";
import {
  CollapsibleContent,
  ExpandIcon,
  RowSelectionText,
  SortArrowContainer,
  SortIconTextContainer,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableHeadRow,
  TableRow,
  TableTag,
} from "../styles/style";
import { EmptyTable } from "./EmptyTable";
import { deepCopy, returnTrueValue } from "./utility";
import { ChevronDown, ChevronUp } from "lucide-react"; // Import icons for expand/collapse

export const Table = ({
  data,
  columns,
  checkboxSelection,
  pagination,
  emptyTableMessage,
  className,
  footer,
  selectedIds,
  setSelectedIds,
  isLoading,
  collapsible,
}: TableProps) => {
  const [activeColumn, setActiveColumn] = useState<string>("");
  const [initialData, setInitialData] = useState<Array<any>>([]);
  const [columnData, setColumnData] = useState<Array<ColumnWithSortingType>>(
    []
  );
  const [selectedRowCount, setSelectedRowCount] = useState<number>(0);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set()); // Track expanded rows

  // Reference

  // Reference

  const toggleRowExpand = (rowId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  // Check if a row is expanded
  const isRowExpanded = (rowId: string) => expandedRows.has(rowId);

  // Check if a row has nested data that can be expanded
  const hasNestedData = (record: any) => {
    if (!collapsible) return false;
    const nestedData = record[collapsible.nestedDataField];
    return nestedData && Array.isArray(nestedData) && nestedData.length > 1; // Only return true if more than 1 invoice
  };

  // Skeleton Table Component
  const SkeletonTable = ({
    columns,
    checkboxSelection,
    rows = 5,
  }: {
    columns: ColumnType[];
    checkboxSelection?: boolean;
    rows?: number;
  }) => {
    return (
      <TableContainer>
        <TableTag>
          <TableHeader>
            <TableHeadRow>
              {checkboxSelection && (
                <TableCell style={{ textAlign: "left", marginLeft: "12px" }}>
                  <Skeleton width="32px" height="20px" />
                </TableCell>
              )}
              {columns.map((_, index) => (
                <TableCell key={index} style={{ padding: "12px 16px" }}>
                  <Skeleton width="70%" height="20px" />
                </TableCell>
              ))}
            </TableHeadRow>
          </TableHeader>
          <TableBody className="h-full ">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {checkboxSelection && (
                  <TableCell>
                    <Skeleton
                      width="20px"
                      height="40px"
                      delay={rowIndex * 0.1}
                    />
                  </TableCell>
                )}
                {columns.map((_, cellIndex) => (
                  <TableCell key={`${rowIndex}-${cellIndex}`}>
                    <Skeleton
                      width={cellIndex % 3 === 0 ? "90%" : "70%"}
                      height="20px"
                      delay={rowIndex * 0.1 + cellIndex * 0.05}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </TableTag>
      </TableContainer>
    );
  };

  const loadData = (data) => {
    let newArray = [];
    //append addition field isChecked for checkbox
    if (data?.length > 0) {
      data?.map((val) => {
        const newObj = Object.assign(val, { isChecked: false });
        newArray.push(newObj);
      });
    }
    setInitialData(newArray);
  };

  const loadColumn = (columns) => {
    let columnArray = [];
    //append addition field sortingType for sorting
    columns.map((val) => {
      columnArray.push({ ...val, sortingType: "asc" });
    });
    setColumnData(columnArray);
  };

  const handleCheckBox = (uniqueValue: string, checked: boolean) => {
    setSelectedRowIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (checked) {
        newSelected.add(uniqueValue);
      } else {
        newSelected.delete(uniqueValue);
      }

      // Callback to notify parent about selection changes
      const selectedItems = initialData.filter((data) =>
        newSelected.has(data?.[`${checkboxSelection?.uniqueField}`])
      );
      checkboxSelection?.onSelectionChange?.(selectedItems);

      return newSelected;
    });
  };

  useEffect(() => {
    const selectedRowIdsArray = Array.from(selectedRowIds);
    setSelectedIds(selectedRowIdsArray);
  }, [selectedRowIds]);

  const handleHeaderCheckBox = (checked: boolean) => {
    setSelectedRowIds((prevSelected) => {
      const newSelected = new Set<string>(prevSelected);

      if (checked) {
        // Add all rows from the current data
        initialData.forEach((row) => {
          newSelected.add(row[`${checkboxSelection?.uniqueField}`]);
        });
      } else {
        // Remove all rows from the current data
        initialData.forEach((row) => {
          newSelected.delete(row[`${checkboxSelection?.uniqueField}`]);
        });
      }

      // Callback to notify parent about selection changes
      const selectedItems = initialData.filter((data) =>
        newSelected.has(data?.[`${checkboxSelection?.uniqueField}`])
      );
      checkboxSelection?.onSelectionChange?.(selectedItems);

      return newSelected;
    });
  };

  const handleHeaderCheckBoxState = () => {
    // If no rows are selected, return false
    if (selectedRowIds.size === 0) return false;

    // If all rows in the current data are selected, return true
    return initialData.every((row) =>
      selectedRowIds.has(row[`${checkboxSelection?.uniqueField}`])
    );
  };

  const handleASCSorting = (fieldName: string, sortBy?: string) => {
    setActiveColumn(fieldName);
    //Change SortingType value
    let sortTypeUpdatedArray = [];
    columnData.map((e: any) => {
      if (e.dataIndex === fieldName) {
        sortTypeUpdatedArray.push({
          ...e,
          sortingType: "asc",
        });
      } else {
        sortTypeUpdatedArray.push({
          ...e,
        });
      }
    });

    setColumnData(sortTypeUpdatedArray);
    function compare(a, b) {
      let value1 = returnTrueValue(
        isNaN(a[`${fieldName}`])
          ? a[`${fieldName}`].toLowerCase()
          : a[`${fieldName}`]
      );
      let value2 = returnTrueValue(
        isNaN(b[`${fieldName}`])
          ? b[`${fieldName}`].toLowerCase()
          : b[`${fieldName}`]
      );

      if (value1 < value2) {
        return -1;
      }
      if (value1 > value2) {
        return 1;
      }
      return 0;
    }

    function compareDate(a, b) {
      // Convert string dates into `Date` objects
      const date1: any = new Date(a[`${fieldName}`]);
      const date2: any = new Date(b[`${fieldName}`]);

      return date1 - date2;
    }

    //sorted Array according to sortBy
    let sortArray;
    if (sortBy === "Numeric") {
      sortArray = initialData.sort(compare);
    } else if (sortBy === "Alphabetical") {
      sortArray = initialData.sort(compare);
    } else if (sortBy === "Date") {
      sortArray = initialData.sort(compareDate);
    }

    //DeepCopy
    const deepCopyData = deepCopy(sortArray);
    setInitialData(deepCopyData);
  };

  const handleDESCSorting = (fieldName: string, sortBy?: string) => {
    setActiveColumn(fieldName);
    //Change SortingType value
    let sortTypeUpdatedArray = [];
    columnData.map((e: any) => {
      if (e.dataIndex === fieldName) {
        sortTypeUpdatedArray.push({
          ...e,
          sortingType: "desc",
        });
      } else {
        sortTypeUpdatedArray.push({
          ...e,
        });
      }
    });
    setColumnData(sortTypeUpdatedArray);

    //Compare Alphabet and Number
    function compare(a, b) {
      let value1 = returnTrueValue(
        isNaN(a[`${fieldName}`])
          ? a[`${fieldName}`].toLowerCase()
          : a[`${fieldName}`]
      );
      let value2 = returnTrueValue(
        isNaN(b[`${fieldName}`])
          ? b[`${fieldName}`].toLowerCase()
          : b[`${fieldName}`]
      );

      if (value1 < value2) {
        return 1;
      }
      if (value1 > value2) {
        return -1;
      }
      return 0;
    }

    function compareDate(a, b) {
      // Convert string dates into `Date` objects
      const date1: any = new Date(a[`${fieldName}`]);
      const date2: any = new Date(b[`${fieldName}`]);

      return date2 - date1;
    }

    //sorted Array according to sortBy
    let sortArray;
    if (sortBy === "Numeric") {
      sortArray = initialData.sort(compare);
    } else if (sortBy === "Alphabetical") {
      sortArray = initialData.sort(compare);
    } else if (sortBy === "Date") {
      sortArray = initialData.sort(compareDate);
    }

    //DeepCopy
    const deepCopyData = deepCopy(sortArray);
    setInitialData(deepCopyData);
  };

  const handleCustomSortingAction = (fieldName: string) => {
    setActiveColumn(fieldName);

    function toggle(val: string) {
      if (val === "asc") {
        return "desc";
      } else if (val === "desc") {
        return "asc";
      }
    }
    //Change SortingType value
    let sortTypeUpdatedArray = [];
    columnData.map((e: any) => {
      if (e.dataIndex === fieldName) {
        sortTypeUpdatedArray.push({
          ...e,
          sortingType: toggle(e?.sortingType),
        });
      } else {
        sortTypeUpdatedArray.push({
          ...e,
        });
      }
    });
    setColumnData(sortTypeUpdatedArray);
  };

  // In Table.tsx - Update the handleTableBodyRender function
  const handleTableBodyRender = (record) => {
    const rowId =
      record?._id || record?.integrationId || JSON.stringify(record);
    const canExpand = hasNestedData(record);
    const isExpanded = isRowExpanded(rowId);
    const nestedData = canExpand ? record[collapsible.nestedDataField] : [];

    return (
      <>
        {/* Main row */}
        <TableRow key={`row-${rowId}`}>
          <>
            {checkboxSelection && (
              <TableCell>
                <Checkbox
                  value="master"
                  size="lg"
                  checked={selectedRowIds.has(
                    record?.[`${checkboxSelection?.uniqueField}`]
                  )}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleCheckBox(
                      record?.[`${checkboxSelection?.uniqueField}`],
                      e.target.checked
                    )
                  }
                />
              </TableCell>
            )}
            {columnData?.map((colData: ColumnType, index: number) => {
              const isExpandColumn = collapsible
                ? (collapsible.expandColumnIndex === undefined &&
                    index === 0) ||
                  index === collapsible.expandColumnIndex
                : false;

              return (
                <TableCell key={`${rowId}-${index}`} align={"left"}>
                  <div className="flex items-center gap-2">
                    {colData?.dataIndex ? (
                      <span>
                        {colData.render
                          ? colData.render(record, index, isExpanded, {
                              expandedRows,
                              setExpandedRows,
                              rowId,
                            })
                          : record[colData?.dataIndex]}
                      </span>
                    ) : (
                      colData.render(record, index, isExpanded, {
                        expandedRows,
                        setExpandedRows,
                        rowId,
                      })
                    )}

                    {isExpandColumn && canExpand && (
                      <ExpandIcon
                        onClick={(e) => toggleRowExpand(rowId, e)}
                        className={isExpanded ? "expanded" : ""}
                      >
                        {isExpanded ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </ExpandIcon>
                    )}
                  </div>
                </TableCell>
              );
            })}
          </>
        </TableRow>

        {/* Expanded nested rows */}
        {isExpanded &&
          nestedData.map((nestedItem, nestedIndex) => (
            <TableRow
              key={`${rowId}-nested-${nestedIndex}`}
              className="nested-row"
            >
              {checkboxSelection && <TableCell />}
              {columnData.map((colData, colIndex) => (
                <TableCell
                  key={`${rowId}-nested-${nestedIndex}-${colIndex}`}
                  align={"left"}
                >
                  {colData?.dataIndex ? (
                    <span>{nestedItem[colData?.dataIndex]}</span>
                  ) : (
                    colData.render(nestedItem, nestedIndex, false, {
                      expandedRows,
                      setExpandedRows,
                      rowId,
                    })
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </>
    );
  };

  useEffect(() => {
    if (data) {
      loadData(data);
    }
    setSelectedRowCount(0);
  }, [data]);

  useEffect(() => {
    loadColumn(columns);
  }, [columns]);

  return (
    <>
      {isLoading ? (
        <SkeletonTable
          columns={columns}
          checkboxSelection={checkboxSelection}
        />
      ) : initialData?.length > 0 ? (
        <div>
          <TableContainer className={`${className} `}>
            <TableTag>
              <TableHeader>
                <TableHeadRow>
                  {checkboxSelection && (
                    <TableCell
                      style={{ textAlign: "left", marginLeft: "12px" }}
                    >
                      <Checkbox
                        value="master"
                        size="lg"
                        checked={handleHeaderCheckBoxState()}
                        onChange={(e) => handleHeaderCheckBox(e.target.checked)}
                      ></Checkbox>
                      <div></div>
                    </TableCell>
                  )}
                  <>
                    {columnData?.map((header: ColumnWithSortingType, index) => (
                      <TableCell
                        style={{
                          fontSize: 12.435,
                          color: "#7F7F7F",
                          fontWeight: 600,
                          textAlign: "left",
                        }}
                        key={index}
                        width={header?.width}
                      >
                        <SortIconTextContainer
                          disableCursor={!header?.sortBy}
                          headAlign={header.headAlign}
                          onClick={() => {
                            if (header?.onActive) {
                              //return active column
                              header?.onActive &&
                                header?.onActive(header?.dataIndex);
                              handleCustomSortingAction(header?.dataIndex);
                            }
                            //Descending
                            else {
                              if (
                                header?.sortingType === "asc" &&
                                (header?.sortBy === "Alphabetical" ||
                                  header?.sortBy === "Numeric" ||
                                  header?.sortBy === "Date")
                              ) {
                                handleDESCSorting(
                                  header?.dataIndex && header?.dataIndex,
                                  header?.sortBy
                                );
                              }
                              //Ascending
                              else if (
                                header?.sortingType === "desc" &&
                                (header?.sortBy === "Alphabetical" ||
                                  header?.sortBy === "Numeric" ||
                                  header?.sortBy === "Date")
                              ) {
                                handleASCSorting(
                                  header?.dataIndex && header?.dataIndex,
                                  header?.sortBy
                                );
                              }
                            }
                          }}
                        >
                          {header?.title}
                          {/* Sort when dataIndex and sortBy provided*/}
                          {header?.sortBy && header?.dataIndex && (
                            <SortArrowContainer
                              active={activeColumn === header?.dataIndex}
                            >
                              <SortArrow
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  bottom: 0,
                                  margin: "auto 10px",
                                }}
                                isRotate={header?.sortingType === "desc"}
                              />
                            </SortArrowContainer>
                          )}
                        </SortIconTextContainer>
                      </TableCell>
                    ))}
                  </>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {pagination
                  ? activePageData.map((record) =>
                      handleTableBodyRender(record)
                    )
                  : initialData?.map((record) => handleTableBodyRender(record))}
              </TableBody>
            </TableTag>
          </TableContainer>
          {footer && (
            <TableFooter>
              {selectedRowCount > 0 && (
                <RowSelectionText>{`${selectedRowCount} rows selected`}</RowSelectionText>
              )}
            </TableFooter>
          )}
        </div>
      ) : (
        <EmptyTable title={emptyTableMessage || <DeviceFlowLoader />} />
      )}
    </>
  );
};

export interface TableProps {
  data: Array<any>;
  columns: Array<ColumnType>;
  footer?: boolean;
  isLoading?: boolean;
  selectedIds: string[];
  setSelectedIds: (state: any) => void;
  pagination?: {
    //Pagination is from server or client by default(client)
    type?: "serverSide" | "clientSide";

    //TotalPages is mandatory when type is serverSide
    totalPages?: number;

    //Row to display per page
    itemsPerPage?: number;

    //Callback to return current page
    onClickPage?: (page: any) => void;
  };
  checkboxSelection?: {
    //unique field for checkbox selection
    uniqueField: string;

    //callback to return all selected rows
    onSelectionChange?: (selectedItems: any) => void;
  };
  collapsible?: {
    // Field name that contains nested data
    nestedDataField: string;
    // Function to render nested data
    renderNestedData: (data: any, index: number) => React.ReactNode;
    // Which column should show the expand/collapse icon (defaults to first column)
    expandColumnIndex?: number;
  };
  emptyTableMessage?: string;
  className?: string;
}

export type SortByType = "Alphabetical" | "Numeric" | "Date" | "Custom";
export interface ColumnType {
  //Table header Title
  title?: string;

  //
  dataIndex?: string;

  //used to render action buttons
  render?: (
    record: any,
    index?: number,
    isExpanded?: boolean,
    context?: {
      expandedRows: Set<string>;
      setExpandedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
      rowId: string;
    }
  ) => React.ReactNode;

  //Sorting type
  sortBy?: SortByType | string;

  //callback to return current Column
  onActive?: (currentColumn: string) => void;

  //column width
  width?: any;

  headAlign?: "flex-start" | "flex-end" | "center" | string;
  textAlign?: "left" | "center" | "right" | "justify" | "char" | undefined;
}

interface ColumnWithSortingType extends ColumnType {
  sortingType: string;
}
