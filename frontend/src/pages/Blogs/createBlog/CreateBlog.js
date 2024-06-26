import styles from "./createBlog.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { ProtectRoutes } from "../../../manageRoutes/protectRoutes";
import { createBlog, updateBlog } from "./../../../actions/blogActions";
import { useAuthStore } from "../../../store/store";
import TextField from "@mui/material/TextField";
import { Snackbar } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import Collapse from "@mui/material/Collapse";

const modules = {
	toolbar: [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		[{ font: [] }],
		[{ size: [] }],
		["bold", "italic", "underline", "strike", "blockquote"],
		[
			{ list: "ordered" },
			{ list: "bullet" },
			{ indent: "-1" },
			{ indent: "+1" },
		],
		["link", "image"],
	],
};

const CreateBlog = () => {
	const navigate = useNavigate();
	const location = useLocation().state;
	const mode = location ? "edit" : "create";
	const [selectedImage, setSelectedImage] = useState(null);
	const user = useAuthStore.getState().user;
	const [snackBarOpen, setSnackBarOpen] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState("");
	const [isEditorMode, setIsEditorMode] = useState(true);
	const [value, setValue] = useState(
		mode === "create" ? "" : location?.blog?.blogHtml
	);
	const [title, setTitle] = useState(
		mode === "create" ? "" : location?.blog?.title
	);

	const calculateReadingTime = (value) => {
		const averageReadingSpeed = 200;
		const readingTimeInMinutes = Math.ceil(value.length / averageReadingSpeed);
		const roundedReadingTime = Math.ceil(readingTimeInMinutes / 5) * 5;
		const cappedReadingTime = Math.min(roundedReadingTime, 60);
		return cappedReadingTime;
	};

	const handleSave = async () => {
		if (title === "") {
			setSnackBarMessage("Title can't be empty");
			setSnackBarOpen((p) => true);
		} else if (value === "") {
			setSnackBarMessage("Blog content can't be empty");
			setSnackBarOpen((p) => true);
		} else if (!selectedImage) {
			setSnackBarMessage("Select a cover image for the blog");
			setSnackBarOpen((p) => true);
		} else {
			const readingTime = calculateReadingTime(value);
			if (mode === "create") {
				const formData = new FormData();
				formData.append("image", selectedImage);
				formData.append("userId", user.data._id);
				formData.append("userName", user.data.name);
				formData.append("minRead", readingTime);
				formData.append("blogHtml", value);
				formData.append("title", title);
				const response = await createBlog(formData);
				if (response.success) {
					setSnackBarMessage("Blog created");
					setSnackBarOpen(true);
					navigate("/blogs");
				}
			} else {
				const response = await updateBlog({
					blogId: location?.blog?._id,
					update: {
						userId: user.data._id,
						userName: user.data.name,
						minRead: readingTime,
						blogHtml: value,
						title: title,
					},
				});

				if (response.success) {
					setSnackBarMessage("Blog updated");
					setSnackBarOpen(true);
				}
			}
		}
	};
	const handleImageChange = (e) => {
		setSelectedImage(e.target.files[0]);
	};
	return (
		<ProtectRoutes>
			<div className={styles.container}>
				<button
					className={styles.modeButton}
					onClick={() => setIsEditorMode((p) => !p)}
				>
					{isEditorMode ? "View Mode" : "Editor Mode"}
				</button>
				<div className={styles.row}>
					<Collapse in={isEditorMode} orientation="horizontal">
						<div className={styles.editor}>
							<label htmlFor="title-id" style={{ width: "10%" }}>
								Title :{" "}
							</label>
							<input
								id="title-id"
								style={{ padding: "5px", width: "90%", marginBottom: "5px" }}
								placeholder="Enter the blog title..."
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<br />
							{mode === "create" ? (
								<>
									<label htmlFor="image">Blog Banner : </label>
									<input
										id="image"
										type="file"
										name="image"
										onChange={handleImageChange}
									/>
								</>
							) : (
								""
							)}
							<ReactQuill
								theme="snow"
								value={value}
								onChange={setValue}
								className="editor-input"
								modules={modules}
							/>
						</div>
					</Collapse>
					<Collapse in={!isEditorMode} orientation="horizontal">
						{value.length === 0 && <h1>Blog empty</h1>}
						<div
							className={`${styles.preview} ql-editor`}
							dangerouslySetInnerHTML={{ __html: value }}
						></div>
					</Collapse>
				</div>
				<button onClick={handleSave}>Save</button>
				<Snackbar
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
					open={snackBarOpen}
					autoHideDuration={1500}
					onClose={() => setSnackBarOpen(false)}
				>
					{snackBarMessage}
				</Snackbar>
			</div>
		</ProtectRoutes>
	);
};

export default CreateBlog;
