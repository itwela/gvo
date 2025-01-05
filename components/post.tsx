import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { FontAwesome } from "@expo/vector-icons";
import { gvoColors } from "@/constants/Colors";
import { fontSizes } from "@/constants/Fontsizes";
import sql from "@/helpers/neonClient";
import { useEffect, useState } from "react";
import { useGVOContext } from "@/constants/gvoContext";
import { useUser } from "@clerk/clerk-expo";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function Post({
  id,
  clerk_id,
  image,
  username,
  created,
  content,
  likes: initialLikes,
  handleLike,
  handleUnlike,
  deletePost
}: {
  id: any;
  clerk_id: any;
  image: string;
  username: string;
  created: any;
  content: string;
  likes: number;
  handleLike: any;
  handleUnlike: any;
  deletePost: any;
}) {
  const { user } = useUser();
  const uid = user?.id;
  const { likedPosts, setLikedPosts, setWantsToAuthenticate } = useGVOContext();

  const [likes, setLikes] = useState(initialLikes);

  const logposts =  () => {
    console.log(likedPosts)
  }

  // const checkPostLike = async () => {
  //   const result = await sql`SELECT * FROM post_likes WHERE clerk_id = ${uid} AND post_id = ${id}`;
  //   setLikedPosts?.((prev: any) => ({
  //     ...prev,
  //     [id]: result.length > 0,
  //   }));
  // };

  // useEffect(() => {
  //   checkPostLike();
  // }, [id]);

  // const deletePost = async () => {
  //   try {
  //     await sql`DELETE FROM posts WHERE id = ${id}`;
  //     console.log("Post deleted");
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //   }
  // };

  return (
    <View style={styles.thread}>
      <View style={styles.threadbox}>
        <View style={{ width: "10%", height: "100%" }}>
          <View style={styles.personImage}>
            <FastImage
              source={{ uri: image }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 100,
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: "90%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <Text onPress={logposts} style={styles.personName}>{username}</Text>
              <Text style={styles.time}>
                {(() => {
                  const createdAt = new Date(created);
                  const now = new Date();
                  const diffInMs = now.getTime() - createdAt.getTime();
                  const diffInMinutes = Math.floor(
                    Math.abs(diffInMs) / (1000 * 60)
                  );
                  const diffInHours = Math.floor(diffInMinutes / 60);
                  const diffInDays = Math.floor(diffInHours / 24);
                  const diffInWeeks = Math.floor(diffInDays / 7);

                  if (diffInWeeks >= 1) {
                    return `${diffInWeeks}w ago`;
                  } else if (diffInDays >= 1) {
                    return `${diffInDays}d ago`;
                  } else if (diffInHours >= 1) {
                    return `${diffInHours}h ago`;
                  } else {
                    return `${diffInMinutes}m ago`;
                  }
                })()}
              </Text>
            </View>
            {clerk_id === uid && (
              <TouchableOpacity
                onPress={() => {
                  deletePost(id);
                }}
                activeOpacity={0.9}
              >
                <FontAwesome
                  name="trash"
                  size={15}
                  color={gvoColors.semidark}
                  style={{ paddingRight: 20 }}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.personText}>{content}</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              paddingVertical: 10,
            }}
          >
            <SignedIn>

              <TouchableOpacity
                onPress={() => likedPosts?.[id]?.liked === true ? handleUnlike(uid, id) : handleLike(uid, id)
                }
                activeOpacity={0.9}
                >
                <FontAwesome
                  name={likedPosts?.[id]?.liked === true ? "heart" : "heart-o"}
                  size={15}
                  color={ likedPosts?.[id]?.liked === true ? gvoColors.azure : gvoColors.dutchWhite }
                  style={{ marginRight: 5 }}
                  />
              </TouchableOpacity>

            </SignedIn>

            <SignedOut>
              <TouchableOpacity
                onPress={() => {
                  setWantsToAuthenticate?.(true);
                }}
                activeOpacity={0.9}
              >
                <FontAwesome
                  name="heart-o"
                  size={15}
                  color={gvoColors.dutchWhite}
                  style={{ marginRight: 5 }}
                />
              </TouchableOpacity>
            </SignedOut>

            <Text
              style={{
                color: likedPosts?.[id]?.liked === true ? gvoColors.azure : gvoColors.dutchWhite,
              }}
            >
              {likedPosts?.[id]?.like_count || 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
    opacity: 0,
  },
  roomText: {
    fontSize: fontSizes.medium,
    fontWeight: "bold",
    color: gvoColors.dutchWhite,
  },
  roomContainer: {
    borderRadius: 10,
    padding: 5,
    minHeight: 100,
  },
  roomHeader: {
    backgroundColor: gvoColors.emerald,
    borderRadius: 10,
    padding: 5,
  },
  thread: {
    width: "100%",
    height: 100,
    borderBottomWidth: 1,
    borderColor: gvoColors.semidark,
    marginBottom: 10,
  },
  threadbox: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  personName: {
    fontSize: fontSizes.small + 1,
    fontWeight: "bold",
    color: gvoColors.azure,
  },
  personText: {
    fontSize: fontSizes.small,
    color: gvoColors.dutchWhite,
  },
  personImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  time: {
    fontSize: fontSizes.small,
    color: gvoColors.dutchWhite,
    opacity: 0.5,
  },
});