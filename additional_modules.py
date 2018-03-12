# Here will be help functions
import firebase_admin
from firebase_admin import auth

def check_token(id_token):
    if not id_token:
        return False
    try:
        # Verify the ID token while checking if the token is revoked by
        # passing check_revoked=True.
        decoded_token = auth.verify_id_token(id_token, check_revoked=True)
        # Token is valid and not revoked.
        uid = decoded_token['uid']
        return uid
    except auth.AuthError as exc:
        if exc.code == 'ID_TOKEN_REVOKED':
            # Token revoked, inform the user to reauthenticate or signOut().
            return False
    except:
            # Token is invalid
        return False