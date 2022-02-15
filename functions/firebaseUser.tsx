import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"

//when user shuts down the app
export const hanldeShutDown = async () => {
    await firestore().collection('currentUsers').doc(auth().currentUser?.uid).delete()
    auth().signOut().then(() => {
        console.log("app turned off")
    })
}

export async function getServerSideProps(userUid: string) {
    const ref = firestore().collection("chats").doc(userUid)

    //Prep the messeges on the server
    const messegesRes = await ref
        .collection("messages")
        .orderBy("timestamp", "asc")
        .get()

    const messages = messegesRes.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        .map((messages) => ({
            ...messages,
            // timestamp: messages.timestamp.toDate().getTime()
        }))

    //Prep  the chats
    const chatRes = await ref.get()
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}