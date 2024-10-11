import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineCheck, HiOutlineXCircle } from "react-icons/hi";
import {
  Flowbite,
  Select,
  Table,
  Button,
  Checkbox,
  FloatingLabel,
  Modal,
  Label,
  TextInput,
  Alert,
} from "flowbite-react";

import {
  view,
  createOrUpdate,
  deleteStore,
  resetError,
  resetStatus,
} from "../features/storeSlice";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { BiPlus } from "react-icons/bi";
import {
  HiInformationCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

import lang from "../lang/lang";

import config from "../app/config";

import Header from "../components/header";
import LiftSide from "../components/liftside";

import axios from "axios";

function PaperGroup() {
  //server data
  const [papergroup, setPaperGroup] = useState([]);
  const [paperSetting, setPaperSetting] = useState([]);

  const [delete_id, setDeleteId] = useState("-1");

  const navigate = useNavigate();

  const getData = () => {
    axios
      .get(`${config.server_url}/group/view`)
      .then(function (response) {
        setPaperGroup(response.data.group);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${config.server_url}/papersetting/view`)
      .then(function (response) {
        setPaperSetting(response.data.questions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const createOne = () => {
    axios
      .post(`${config.server_url}/group/create`)
      .then(function (response) {
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteOne = (value) => {
    axios
      .post(`${config.server_url}/group/delete`, { id: value })
      .then(function (response) {
        getData();
        setDeleteId("-1");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cloneSetting = (settingId) => {
    axios
      .post(`${config.server_url}/group/clonesetting`, { id: settingId })
      .then(function (response) {
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const enterPaperSetting = (value) => {
    navigate("/papersetting?id=" + value, { replace: true });
  };

  return (
    <Flowbite>
      <Header></Header>
      <main className="flex flex-row width-1200 mx-auto my-0">
        <LiftSide select={0}></LiftSide>
        <div className="basis-6/7 px-10 py-12 flex flex-col grow">
          <h1 className="text-gray-900">アンケート設定</h1>
          <div className="mt-6">
            <Button
              type="button"
              onClick={() => {
                createOne();
              }}
            >
              新しく作成
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-10 mt-10 w-10/12">
            {papergroup.map((item) => (
              <section
                onClick={() => {
                  enterPaperSetting(item.id);
                }}
                key={item.id}
                className="rounded-lg border border-gray-300  w-56 h-66 relative hover:shadow-lg cursor-pointer ease-in duration-300"
              >
                <span className=" absolute left-1 top-1">{item.id}</span>
                <div className=" absolute -left-2 -top-2 w-56 h-66 border border-gray-300 rotate-6"></div>
                <div className=" absolute -left-2 -top-2 w-56 h-66 border border-gray-300 rotate-2"></div>
                <div className=" absolute top-16 left-10 z-10">
                  <label className=" font-bold text-gray-500" htmlFor="">
                    アンケートペジ数
                  </label>
                  <br></br>
                  {paperSetting.filter(
                    (item1) => parseInt(item1.group_id) === item.id
                  ).length < 10 && (
                    <span className=" text-6xl absolute top-10 left-12 text-gray-500">
                      {
                        paperSetting.filter(
                          (item1) => parseInt(item1.group_id) === item.id
                        ).length
                      }
                    </span>
                  )}
                  {paperSetting.filter(
                    (item1) => parseInt(item1.group_id) === item.id
                  ).length >= 10 && (
                    <span className=" text-6xl absolute top-10 left-6 text-gray-500">
                      {
                        paperSetting.filter(
                          (item1) => parseInt(item1.group_id) === item.id
                        ).length
                      }
                    </span>
                  )}
                </div>
                <div className="absolute bottom-5 right-7 flex flex-row">
                  <button
                    className="ml-1 text-sm border-gray-300 hover:border-gray-500 hover:text-gray-800 active:outline-none focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      cloneSetting(item.id);
                    }}
                  >
                    複製
                  </button>
                  <button
                    type="button"
                    className="ml-1 text-sm bg-transparent hover:border-red-700 active:outline-none focus:outline-none text-red-700 font-semibold py-2 px-4 border border-red-300  rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(item.id);
                    }}
                  >
                    削除
                  </button>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Modal
        show={delete_id !== "-1"}
        size="md"
        onClose={() => {
          setDeleteId("-1");
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              このアンケート設定を削除しますか?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  deleteOne(delete_id);
                }}
              >
                {"はい"}
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setDeleteId("-1");
                }}
              >
                {"いいえ"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Flowbite>
  );
}

export default PaperGroup;
