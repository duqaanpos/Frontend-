package hu.dpal.phonegap.plugins;

import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.MotionEvent;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

public class CallbackProgressDialog extends ProgressDialog {

	public static CallbackContext callbackContext;

	public CallbackProgressDialog(Context context) {
		super(context);
	}

	public static CallbackProgressDialog show(Context context,
                                              CharSequence title, CharSequence message, boolean indeterminate,
                                              boolean cancelable, OnCancelListener cancelListener,
                                              CallbackContext callbackContext) {
		CallbackProgressDialog.callbackContext = callbackContext;
		CallbackProgressDialog dialog = new CallbackProgressDialog(context);
		dialog.setTitle(title);
		dialog.setMessage(message);
		dialog.setIndeterminate(indeterminate);
		dialog.setCancelable(cancelable);
		dialog.setOnCancelListener(cancelListener);
		dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
		dialog.show();
		return dialog;
	}

	private void sendCallback() {
		PluginResult pluginResult = new PluginResult(PluginResult.Status.OK);
		pluginResult.setKeepCallback(true);
		callbackContext.sendPluginResult(pluginResult);
	}

	@Override
	public void onBackPressed() {
		sendCallback();
	}

	@Override
	public boolean onTouchEvent(MotionEvent event) {
		if (event.getAction() == MotionEvent.ACTION_DOWN) {
			sendCallback();
			return true;
		}
		return false;
	}

}