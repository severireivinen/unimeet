import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HeartIcon, StarIcon, XIcon } from "@heroicons/react/solid";
import { AcademicCapIcon, InformationCircleIcon } from "@heroicons/react/solid";
import TinderCard from "react-tinder-card";
import Loader from "./Loader";
import { firestore } from "../firebase/firebase";
import { useSession } from "next-auth/client";

function CardSwiper() {
  const [profiles, setProfiles] = useState([]);
  const [session] = useSession();

  useEffect(() => {
    async function getProfiles() {
      const res = await fetch(`http://localhost:3000/api/get-profiles`);
      const data = await res.json();
      setProfiles(data);
    }
    getProfiles();
  }, [session]);

  const swiped = async (direction, card) => {
    console.log(direction);
    console.log(card);
    if (!card) return;

    if (direction === "left") {
      await firestore
        .collection("users")
        .doc(session.user.id)
        .collection("dislikes")
        .doc(card.id)
        .set(card);
    }

    if (direction === "right") {
      await firestore
        .collection("users")
        .doc(session.user.id)
        .collection("likes")
        .doc(card.id)
        .set(card);
    }
    if (direction === "left" || direction === "right") {
      //console.log("removing: " + user.name);
      //console.log(direction);
    }
  };

  const outOfFrame = (user) => {
    //console.log(user.name + " left the screen!");
    //setProfiles(people.filter((u) => u.id !== user.id));
  };

  if (profiles.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <main className="flex-1 relative overflow-hidden">
      {profiles.map((user) => (
        <TinderCard
          key={user.id}
          onSwipe={(direction) => swiped(direction, user)}
          onCardLeftScreen={() => outOfFrame(user)}
          preventSwipe={["up", "down"]}
          className="absolute inset-0 flex"
        >
          <div className="bg-gray-100 rounded-lg h-full w-full smlg:h-[680px] smlg:w-[380px] p-2 smlg:p-0 m-auto">
            {/** Image */}
            <div className="relative h-full w-full">
              <img
                src={user.profileImg}
                className="object-cover w-full h-full rounded-lg"
                alt="user image"
              />

              {/**Buttons */}
              <section className="absolute bottom-0 text-white bg-gradient-to-t from-black via-black to to-black/1 w-full h-40 rounded-b-lg">
                <div className="flex justify-around h-full items-end pb-3">
                  <div className="border-2 border-red-500 rounded-full p-1">
                    <XIcon className="h-8 text-red-500" />
                  </div>
                  <div className="border-2 border-cyan-500 rounded-full p-1">
                    <StarIcon className="h-8 text-cyan-500" />
                  </div>
                  <div className="border-2 border-green-500 rounded-full p-1">
                    <HeartIcon className="h-8 text-green-500" />
                  </div>
                </div>
              </section>
              {/**Info */}
              <section className="absolute bottom-20 left-3 flex flex-col text-white">
                <h2 className="font-semibold text-3xl">{user.name}</h2>
                <div className="flex items-center space-x-1">
                  <AcademicCapIcon className="h-4" />
                  <p>{user.school}</p>
                </div>
              </section>
            </div>
          </div>
        </TinderCard>
      ))}
    </main>
  );
}

export default CardSwiper;
