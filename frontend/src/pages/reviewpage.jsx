import React from "react";
import { useEffect, useState } from "react";
import {
  Flowbite,
  Button,
  TextInput,
  Select,
  Checkbox,
  Modal,
} from "flowbite-react";
import axios from "axios";
import {
  BsReverseLayoutTextSidebarReverse,
  BsCloudDownload,
} from "react-icons/bs";

import moment from "moment";

import Header from "../components/header";
import LiftSide from "../components/liftside";

import config from "../app/config";

import lang from "../lang/lang";
import Datepicker from "react-tailwindcss-datepicker";

function ReviewPage() {
  //condition
  const [storeNames, setStoreNames] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [unread, setUnread] = useState("-1");

  const [storeName, setStoreName] = useState("All");
  const [year, setYear] = useState("-1");
  const [month, setMonth] = useState("-1");
  const [day, setDay] = useState("-1");

  const [sort, setSort] = useState("2");
  const [pageno, setPageNo] = useState(1);

  //datas
  const [reviewData, setReviewData] = useState([]);
  const [allCount, setAllCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);

  //new data
  const [detail_id, setDetail_id] = useState("-1");
  const [rdate, setRDate] = useState({
    startDate: null,
    endDate: null
  });

  const handleValueChange = (newRDate) => {
    setRDate(newRDate);
  }

  const detailView = (id) => {
    axios
      .post(`${config.server_url}/review/setReadState`, { id })
      .then(function (response) {
        setDetail_id(id);

        find();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const find = () => {
    axios
      .post(`${config.server_url}/review/getReviewData`, {
        storeName,
        keyword,
        unread,
        startDate: rdate.startDate,
        endDate: rdate.endDate,
        sort,
        pageno,
      })
      .then(function (response) {
        setReviewData(response.data.reviewData);
        setAllCount(response.data.allCount);
        setMatchCount(response.data.matchCount);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderPagination = () => {
    let s_no = Math.floor(pageno / 5) + 1;

    let end_no = Math.ceil(matchCount / 30);

    let temp = [];

    if (s_no + 5 <= end_no) {
      for (let i = s_no; i < s_no + 6; i++) {
        if (i === pageno)
          temp.push(
            <a
              key={i}
              onClick={() => {
                e.preventDefault();
                setPageNo(i);
              }}
              href="#"
              className="pagenatione-active relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {i}
            </a>
          );
        else
          temp.push(
            <a
              key={i}
              onClick={() => {
                e.preventDefault();
                setPageNo(i);
              }}
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              {i}
            </a>
          );
      }
      // return ([

      //   <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{s_no + 1}</a>,
      //   <a href="#" className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">{s_no + 1}</a>,
      //   <a href="#" className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">{s_no + 1}</a>,
      //   <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{s_no + 1}</a>
      // ])
    } else {
      for (let i = s_no; i < end_no + 1; i++)
        if (i === pageno)
          temp.push(
            <a
              key={i}
              onClick={(e) => {
                e.preventDefault();
                setPageNo(i);
              }}
              href="#"
              className="pagenatione-active relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {i}
            </a>
          );
        else
          temp.push(
            <a
              key={i}
              onClick={(e) => {
                e.preventDefault();
                setPageNo(i);
              }}
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              {i}
            </a>
          );
    }

    return temp;
  };

  useEffect(() => {
    axios
      .post(`${config.server_url}/review/getReviewData`, {
        storeName,
        keyword,
        unread,
        startDate: rdate.startDate,
        endDate: rdate.endDate,
        sort,
        pageno,
      })
      .then(function (response) {
        setReviewData(response.data.reviewData);
        setAllCount(response.data.allCount);
        setMatchCount(response.data.matchCount);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [storeName, unread, year, month, day, sort, pageno, rdate]);

  useEffect(() => {
    // get store name
    axios
      .get(`${config.server_url}/store/view`)
      .then(function (response) {
        setStoreNames(response.data.store.map((store) => store.store_name));
      })
      .catch((err) => {
        console.log(err);
      });
    // get review data
    axios
      .post(`${config.server_url}/review/getReviewData`, {
        storeName,
        keyword,
        unread,
        startDate: rdate.startDate,
        endDate: rdate.endDate,
        sort,
        pageno,
      })
      .then(function (response) {
        setReviewData(response.data.reviewData);
        setAllCount(response.data.allCount);
        setMatchCount(response.data.matchCount);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const renderDay = () => {
    let temp = [];
    if (month === "-1") {
      return temp;
    }

    if (
      year !== -1 &&
      month !== -1 &&
      (month === "1" ||
        month === "3" ||
        month === "5" ||
        month === "7" ||
        month === "8" ||
        month === "10" ||
        month === "12")
    ) {
      for (let i = 0; i < 32; i++) {
        if (i === 0) {
          temp.push(<option value="-1"></option>);
        } else {
          temp.push(<option value={i}>{i}</option>);
        }
      }
    } else if (
      year !== -1 &&
      month !== -1 &&
      (month === "4" || month === "6" || month === "9" || month === "11")
    ) {
      for (let i = 0; i < 31; i++) {
        if (i === 0) {
          temp.push(<option value="-1"></option>);
        } else {
          temp.push(<option value={i}>{i}</option>);
        }
      }
    } else if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      for (let i = 0; i < 30; i++) {
        if (i === 0) {
          temp.push(<option value="-1"></option>);
        } else {
          temp.push(<option value={i}>{i}</option>);
        }
      }
    } else {
      for (let i = 0; i < 29; i++) {
        if (i === 0) {
          temp.push(<option value="-1"></option>);
        } else {
          temp.push(<option value={i}>{i}</option>);
        }
      }
    }

    return temp;
  };

  const renderContent = () => {
    let q1 = reviewData
      .filter((item) => item.id === detail_id)[0]
      .question_nos.split(",");
    let q2 = reviewData
      .filter((item) => item.id === detail_id)[0]
      .question_names.split(",");
    let a1 = reviewData
      .filter((item) => item.id === detail_id)[0]
      .answers.split(",");
    return q1.map((item, idx) => (
      <div className="">
        <div className="flex flex-row items-center">
          <label htmlFor="">{item + ". "}</label>
          <span>{q2[idx]}</span>
        </div>
        <div>
          {a1[idx] !== "-1" ? a1[idx] : <i className=" text-red-600">回答なし</i>}
        </div>
      </div>
    ));
  };

  return (
    <Flowbite>
      <Header></Header>
      <main className="flex flex-row width-1200 mx-auto my-0 x-17">
        <LiftSide className="" select={2}></LiftSide>
        <div className="grow basis-6/7 px-10 py-12 flex flex-col">
          <h1 className="text-gray-900">調査調査</h1>
          <div className="flex flex-col mt-5">
            <div className="condition1 ml-5 flex flex-row">
              <TextInput
                onKeyDown={(e) => {
                  e.which === 13 && find();
                }}
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
                type="text"
                className="text-3xl width-50-rem"
                name=""
                id=""
              />
              <Button
                className="ml-3"
                type="button"
                onClick={() => {
                  find();
                }}
              >
                検索
              </Button>
            </div>

            <div className="condition2 ml-5 mt-3 flex flex-row border border-gray-300 rounded items-center w-rem-61">
              <div className="condition2_3 ml-1 h-12 rounded  flex flex-row items-center">
                <label className="text-sm py-1 px-1" htmlFor="">
                  店舗名:
                </label>
                <Select
                  onChange={(e) => {
                    setStoreName(e.target.value);
                  }}
                  className="text-sm py-1 px-1 rounded border-gray-500"
                >
                  <option value="All"></option>
                  {storeNames.map((storeName, idx) => (
                    <option key={idx} value={storeName}>
                      {storeName}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="condition2_2 h-12 ml-5 rounded  flex flex-row items-center">
                <label htmlFor="期間">期間:</label>
                <div className="w-72 flex items-center ml-2">
                  <Datepicker
                    i18n={"ja"}
                    configs={{
                      shortcuts: {
                        today: "今日",
                        yesterday: "昨日",
                        past: period => `過去${period}日間`,
                        currentMonth: "現在の月",
                        pastMonth: "過去月"
                      },
                      footer: {
                        cancel: "取り消す",
                        apply: "適用する"
                      }
                    }}
                    primaryColor={"orange"}
                    value={rdate}
                    onChange={handleValueChange}
                    showShortcuts={true}
                  />
                </div>
              </div>

              <div className="condition2_3 ml-2 h-12 rounded  flex flex-row items-center">
                <label htmlFor="" className="text-sm py-1 px-1">
                  ソート
                </label>
                <Select
                  name="sort"
                  className="text-sm py-1 px-1 rounded border-gray-500"
                  id=""
                  onChange={(e) => {
                    setSort(e.target.value);
                  }}
                >
                  <option value="2">登録日の降順</option>
                  <option value="1">登録日の昇順</option>
                </Select>
              </div>

              <div className="condition2_1 ml-1 h-12 rounded  flex flex-row items-center">
                <Checkbox
                  onChange={(event) => {
                    event.target.checked ? setUnread(1) : setUnread(-1);
                  }}
                  className="text-sm mr-1"
                  name=""
                  id=""
                />
                <label htmlFor="">未読</label>
              </div>

              <div className="condition2_3 ml-5 h-12 rounded  flex flex-row items-center">
                <button
                  className="focus:outline-none cus-color1"
                  onClick={() => {
                    location.href = `${config.server_url}/review/excel?storeName=${storeName}&keyword=${keyword}&unread=${unread}&startdate=${rdate.startDate}&enddate=${rdate.endDate}&sort=${sort}`
                  }}
                >
                  <BsCloudDownload className="shadow-2xl" />
                </button>
              </div>

            </div>

            <div className="search_result ml-5 mt-8">
              合計{allCount}件中{matchCount}件検索済み
            </div>

            <div className="overflow-x-auto rounded-none">
              <table className="mt-2 ml-5 border-collapse	w-11/12">
                <thead>
                  <tr className="border border-slate-300 border-l-0 border-r-0">
                    <th className="text-sm px-1 py-4">ID</th>
                    <th className="text-sm px-1 py-4">店舗名</th>
                    <th className="text-sm px-1 py-4">店舗URL </th>
                    <th className="text-sm px-1 py-4">満足度</th>
                    <th className="text-sm px-1 py-4 break-all">登録日</th>
                    <th className="text-sm px-1 py-4 break-all">詳細ビュー</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewData.length !== 0 ? (
                    reviewData.map((item, cdx) => (
                      <tr
                        key={item.id}
                        className="border  border-slate-300 border-l-0 border-r-0"
                      >
                        <td className="text-center px-2 py-2 text-sm ">
                          {(pageno - 1) * 30 + cdx + 1}
                        </td>
                        <td className="text-center px-2 py-2 text-sm break-words">
                          {item.store_name}
                        </td>
                        <td className="text-center px-2 py-2 text-sm break-all">
                          {item.store_business_url}
                        </td>
                        <td className="text-center px-2 py-2 text-sm break-all">
                          {item.answers.split(",")[0]}
                        </td>
                        <td className="text-center px-2 py-2 text-sm">
                          {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                        </td>
                        {item.readState === 0 && (
                          <td className="text-center px-2 py-2 text-sm text-gray hover:underline dark:text-gray cursor-pointer relative">
                            <BsReverseLayoutTextSidebarReverse
                              onClick={() => {
                                detailView(item.id);
                              }}
                              className="shadow-2xl absolute left-1/2 top-3"
                            />
                          </td>
                        )}
                        {item.readState === 1 && (
                          <td className="text-center px-2 py-2 text-sm text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer relative">
                            <BsReverseLayoutTextSidebarReverse
                              onClick={() => {
                                detailView(item.id);
                              }}
                              className="shadow-2xl absolute left-1/2 top-3"
                            />
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr className="py-5 border border-slate-300 border-l-0 border-r-0">
                      <td className="px-2 py-3 text-sm " colSpan={10}>
                        {lang("japan", "no_data")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </a>
              </div>

              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pageno !== 1) setPageNo(pageno - 1);
                      }}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    {renderPagination()}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pageno < Math.ceil(matchCount / 30))
                          setPageNo(pageno + 1);
                      }}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {detail_id !== "-1" && (
          <Modal show={detail_id !== "-1"} onClose={() => setDetail_id("-1")}>
            <Modal.Header>詳細情報</Modal.Header>
            <Modal.Body>
              <div className="space-y-6 flex flex-col">
                <div className="flex flex-row items-end">
                  <label htmlFor="">店舗名 </label>
                  <h2 className="text-2xl ml-3">
                    {reviewData.length !== 0
                      ? reviewData.filter((item) => item.id === detail_id)[0]
                        .store_name
                      : ""}
                  </h2>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">GoogleビジネスURL:</label>
                  <span>
                    {reviewData.length !== 0
                      ? reviewData.filter((item) => item.id === detail_id)[0]
                        .store_business_url
                      : ""}
                  </span>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="">Questionnaire URL:</label>
                  <span>
                    {reviewData.length !== 0
                      ? reviewData.filter((item) => item.id === detail_id)[0]
                        .store_questionnare_url
                      : ""}
                  </span>
                </div>
                <div className="flex flex-row items-end">
                  <label htmlFor="">満足度:</label>
                  <span className="ml-2">
                    {
                      reviewData
                        .filter((item) => item.id === detail_id)[0]
                        .answers.split(",")[0]
                    }
                  </span>

                  <label className="ml-5" htmlFor="">
                    登録日:
                  </label>
                  <span className="ml-2">
                    {moment(
                      reviewData.filter((item) => item.id === detail_id)[0]
                        .createdAt
                    ).format("YYYY-MM-DD HH:mm:ss")}
                  </span>
                </div>
                {renderContent()}
              </div>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        )}
      </main>
    </Flowbite>
  );
}

export default ReviewPage;
